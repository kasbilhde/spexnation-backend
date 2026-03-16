import stripe from "../../config/stripe.js";
import Order from "../../models/Order.js";
import uploadPrescriptionFile from "../../utils/uploadPrescriptionFile.js";


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
        console.error("Error fetching My order:", error);
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


        // body data is here
        const bodyData = req.body;


        // create unique order id here
        const orderID = `OID-${Date.now().toString().slice(-5)}`;

        //uppload prescription image to cloudinary
        const bodyDataWithPrescriptionImageLink = await uploadPrescriptionFile(bodyData);


        // prepere order data object for save in database
        const value = { orderId: orderID, ...bodyDataWithPrescriptionImageLink, };


        // save order data in database
        const order = await Order.create(value);


        // line items prepare here
        const lineItems = bodyData?.items?.map((product) => {


            let finalPrice = product.price;
            // Apply coupon safely
            if (bodyData?.iscoupon) {
                const discount = (finalPrice * bodyData.coupondiscountPercentage) / 100;
                finalPrice = finalPrice - discount;

                // Prevent negative prices
                if (finalPrice < 0) finalPrice = 0;
            }

            const roundUpfinalPrice = Math.round(finalPrice);
            const unitAmount = Math.round(roundUpfinalPrice * 100);

            return {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: `${product.name}${bodyData?.iscoupon ? ` (With Coupon Discount ${bodyData.coupondiscountPercentage}%)` : ""}`,
                        images: [product.image],
                    },
                    unit_amount: unitAmount,
                },
                quantity: product.quantity,
            };
        });




        // payment code is here
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
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
        console.error("Error creating product:", err);
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


        const orderID = `OID - ${Date.now().toString().slice(-5)} `;

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
            currency: bodyData?.currency,
            pdf: bodyData?.pdf,
            coupondiscountPercentage: bodyData?.coupondiscountPercentage,
            discountPrice: bodyData?.discountPrice,
            PaymentTotal: bodyData?.PaymentTotal,
            totalItems: bodyData?.totalItems,
            iscoupon: bodyData?.iscoupon,
            subtotal: bodyData?.subtotal,
            paymentIntent: "",
            stripeSessionId: "",
            paymentStatus: "Pending",
            deliveryStatus: "Pending",
            items: bodyData?.items,
        };

        const order = await Order.create(orderData);




        // line items prepare here
        const lineItems = bodyData?.items?.map((product) => {


            let finalPrice = product.price;
            // Apply coupon safely
            if (bodyData?.iscoupon) {
                const discount = (finalPrice * bodyData.coupondiscountPercentage) / 100;
                finalPrice = finalPrice - discount;

                // Prevent negative prices
                if (finalPrice < 0) finalPrice = 0;
            }

            const roundUpfinalPrice = Math.round(finalPrice);
            const unitAmount = Math.round(roundUpfinalPrice * 100);

            return {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: `${product.name}${bodyData?.iscoupon ? ` (With Coupon Discount ${bodyData.coupondiscountPercentage}%)` : ""}`,
                        images: [product.image],
                    },
                    unit_amount: unitAmount,
                },
                quantity: product.quantity,
            };
        });




        // payment code is here
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
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






/********** reorder controller is here **********/
const repayment = async (req, res) => {


    try {

        const bodyData = req.body;

        // line items prepare here
        const lineItems = bodyData?.items?.map((product) => {


            let finalPrice = product.price;
            // Apply coupon safely
            if (bodyData?.iscoupon) {
                const discount = (finalPrice * bodyData.coupondiscountPercentage) / 100;
                finalPrice = finalPrice - discount;

                // Prevent negative prices
                if (finalPrice < 0) finalPrice = 0;
            }

            const roundUpfinalPrice = Math.round(finalPrice);
            const unitAmount = Math.round(roundUpfinalPrice * 100);

            return {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: `${product.name}${bodyData?.iscoupon ? ` (With Coupon Discount ${bodyData.coupondiscountPercentage}%)` : ""}`,
                        images: [product.image],
                    },
                    unit_amount: unitAmount,
                },
                quantity: product.quantity,
            };
        });




        // payment code is here
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            success_url: `${process.env.LIVE_SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.LIVE_SITE_URL}/payment/cancel`,
            client_reference_id: bodyData?.orderId,
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
    createOrder, deleteOrder, getAllOrders, getSingleOrder, myOrders, reorders, repayment, updateOrder
};

