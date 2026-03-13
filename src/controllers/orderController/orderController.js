import stripe from "../../config/stripe.js";
import Order from "../../models/Order.js";
import uploadSingleFileToCloudinary from "../../utils/uploadSingleFileToCloudinary.js";


/********** get all product controller is here **********/
const getAllOrders = async (req, res) => {


    try {


        // For each product, attach its reviews and reviewer info
        const order = await Order.find({}).sort({ createdAt: -1 }).lean();



        // Return response
        res.status(200).json({
            success: true,
            message: "Order fetched successfully!",
            data: order,
        });

    } catch (error) {
        console.error("Error fetching order:", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching order.",
        });
    }


};






/********** get all product controller is here **********/
const myOrders = async (req, res) => {


    try {


        const { id } = req.params;;


        const myOrder = await Order.find({ userID: id }).sort({ createdAt: -1 }).lean();



        // Return response
        res.status(200).json({
            success: true,
            message: "My Order fetched successfully!",
            data: myOrder,
        });

    } catch (error) {
        console.error("Error fetching My order:", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching order.",
        });
    }


};











/********** get single product controller is here **********/
const getSingleOrder = async (req, res) => {

    try {
        const { id } = req.params;

        // Validate ID format
        if (!id || id.length !== 24) {
            return res.status(400).json({ error: "Invalid Order ID format." });
        }


        // Find product by ID
        const order = await Order.findById(id).sort({ createdAt: -1 }).lean();


        if (!order) {
            return res.status(404).json({ error: "Order not found." });
        }




        // Return the product
        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("Error fetching order:", error.message);
        res.status(500).json({
            success: false,
            error: "Something went wrong while order the product!",
        });
    }

};












/********** create product controller is here **********/
const createOrder = async (req, res) => {




    try {

        const bodyData = req.body;


        const orderID = `OID-${Date.now().toString().slice(-5)}`;

        const PrescriptionImage = await uploadSingleFileToCloudinary(bodyData?.hasData[0]?.prescriptionImage);


        const value = { orderId: orderID, ...bodyData, pdf: "", PrescriptionImage: PrescriptionImage };

        const order = await Order.create(value);


        // payment code is here
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: bodyData?.hasData[0]?.LenseName,
                            images: [bodyData?.hasData[0]?.ProductDetails?.product_Images[bodyData?.hasData[0]?.selectedProductIndex].img[0]],
                        },
                        unit_amount: Math.round(bodyData?.grandTotal * 100),
                    },
                    quantity: 1,
                }
            ],
            success_url: `${process.env.LIVE_SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.LIVE_SITE_URL}/payment/cancel`,
            client_reference_id: orderID,
        });



        // Send success response
        res.status(201).json({
            success: true,
            message: "Order created successfully!",
            url: session.url
        });

    } catch (err) {
        console.error("Error creating product:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while creating the product.",
        });
    }

};





/********** Update  product controller is here **********/
const updateOrder = async (req, res) => {


    try {

        const { id } = req.params;

        // Validate product ID format
        if (!id || id.length !== 24) {
            return res.status(400).json({
                success: false,
                message: "Invalid Order ID format.",
            });
        }



        const value = req.body;



        // Update the product
        const updatedOrder = await Order.findByIdAndUpdate({ _id: id }, { deliveryStatus: value.deliveryStatus }, {
            new: true, // return updated document
            runValidators: true, // enforce schema validation
        });



        //If not found
        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }


        //Success response
        res.status(200).json({
            success: true,
            message: "Order updated successfully!",
            data: updatedOrder,
        });


    } catch (err) {
        console.error("Error updating Order:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while updating the Order.",
        });
    }


};










/********** Delete  product controller is here **********/
const deleteOrder = async (req, res) => {


    try {


        const { id } = req.params;

        // Validate product ID format
        if (!id || id.length !== 24) {
            return res.status(400).json({
                success: false,
                message: "Invalid Order ID format.",
            });
        }



        // Attempt to delete the product
        const deletedOrder = await Order.findByIdAndDelete(id);



        //If no product found
        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }



        //Success response
        res.status(200).json({
            success: true,
            message: "Order deleted successfully!",
            data: deletedOrder,
        });


    } catch (err) {
        console.error("Error deleting Order:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the Order.",
        });
    }


};






/********** reorder controller is here **********/
const reorders = async (req, res) => {




    try {

        const bodyData = req.body;


        const orderID = `OID-${Date.now().toString().slice(-5)}`;




        const orderData = {
            orderId: orderID,
            userID: bodyData?.userID,
            fullname: bodyData?.fullname,
            email: bodyData?.email,
            address1: bodyData?.address1,
            address2: bodyData?.address2,
            city: bodyData?.city,
            state: bodyData?.state,
            country: bodyData?.country,
            zipcode: bodyData?.zipcode,
            PrescriptionImage: bodyData?.PrescriptionImage,
            pdf: "https://res.cloudinary.com/drkwi34bs/image/upload/v1773138480/spexnation/f6pzeplfhlluh1na1uvt.pdf",
            coupondiscount: bodyData?.coupondiscount,
            discountPrice: bodyData?.discountPrice,
            grandTotal: bodyData?.grandTotal,
            iscoupon: bodyData?.iscoupon,
            paymentIntent: "",
            stripeSessionId: "",
            paymentStatus: "Pending",
            deliveryStatus: "Pending",
            hasData: bodyData?.hasData,
        };

        const order = await Order.create(orderData);


        // payment code is here
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: bodyData?.hasData[0]?.LenseName,
                            images: [bodyData?.hasData[0]?.ProductDetails?.product_Images[bodyData?.hasData[0]?.selectedProductIndex].img[0]],
                        },
                        unit_amount: Math.round(bodyData?.grandTotal * 100),
                    },
                    quantity: 1,
                }
            ],
            success_url: `${process.env.LIVE_SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.LIVE_SITE_URL}/payment/cancel`,
            client_reference_id: orderID,
        });



        // Send success response
        res.status(201).json({
            success: true,
            message: "Re Order created successfully!",
            url: session.url
        });

    } catch (err) {
        console.error("Error creating Reorder:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while creating the Reorder.",
        });
    }

};








/*********** modules export from here ************/
export {
    createOrder, deleteOrder, getAllOrders, getSingleOrder, myOrders, reorders, updateOrder
};

