import stripe from "../../config/stripe.js";
import Order from "../../models/Order.js";
import createPdfFile from "../../utils/pdf-ganaration/createPdfFile.js";
import { sendEmail } from "../../utils/sendEmail.js";
import uploadSingleFileToCloudinary from "../../utils/uploadSingleFileToCloudinary.js";

const stripeWebhook = async (req, res) => {

    const { session_id } = req.query;

    if (!session_id) return res.status(400).json({ error: "Session ID required" });

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ["line_items"],
        });


        const orderID = session?.client_reference_id;
        const paymentStatus = session?.payment_status;

        if (!orderID) {
            return res.status(400).json({ error: "Order ID not found in session" });
        }


        // get order data
        const order = await Order.findOne({ orderId: orderID });
        const bodyData = order.toObject();

        // ganarate pdf file with prescription information
        const file = await createPdfFile(bodyData, orderID, paymentStatus);
        const base64 = `data:application/pdf;base64,${file}`;
        const uploadFile = await uploadSingleFileToCloudinary(base64);


        // send email to the admin
        const clientEmail = bodyData.email;
        const adminEmail = process.env.EMAIL_FOR_ORDER;


        await sendEmail([clientEmail, adminEmail], uploadFile);

        // Send job to BullMQ queue
        // const job = await emailSendQueue.add("send-order-email", {
        //     clientEmail,
        //     adminEmail,
        //     adminEmail: process.env.ADMIN_EMAIL
        // }, {
        //     removeOnComplete: true,
        //     removeOnFail: true,
        // });



        // update order
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderID },
            {
                paymentStatus: "paid",
                stripeSessionId: session.id,
                pdf: uploadFile,
                paymentIntent: session.payment_intent
            },
            { new: true }
        );

        res.status(200).json(session);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch session" });
    }
}

export default stripeWebhook;