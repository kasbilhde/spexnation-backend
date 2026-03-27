import Accessories from "../../models/Accessories.js";
import uploadAccessoriesFileToCloudinary from "../../utils/uploadAccessoriesFileToCloudinary.js";
import AccessoriesSchema from "../../validationSchema/Accessories.validation.js";




/********** get all getAllAccessories controller here **************/
const getAllAccessories = async (req, res) => {

    try {
        const users = await Accessories.find();
        res.json({
            success: true,
            message: "All Accessories fetched successfully",
            data: users
        });

    } catch (error) {
        res.status(500).json({ message: "There was a Server Error" });
    }
}



/********** get all getAllAccessories controller here **************/
const getSingleAccessories = async (req, res) => {

    try {
        const { id } = req.params;

        // Validate ID format
        if (!id || id.length !== 24) {
            return res.status(400).json({ error: "Invalid Accessories ID format." });
        }


        // Find product by ID
        const accessories = await Accessories.findById(id).lean();



        if (!accessories) {
            return res.status(404).json({ error: "Accessories not found." });
        }



        // Return the product
        res.status(200).json({
            success: true,
            data: accessories,
        });
    } catch (error) {
        console.error("Error fetching Accessories:", error.message);
        res.status(500).json({
            success: false,
            error: "Something went wrong while fetching the Accessories!",
        });
    }
}






/********************  User registration Controller here ***********************/
const createAccessories = async (req, res) => {


    try {


        // Validate body data using Joi schema
        const { error, value: { name, price, description, shortDes, img, productType } } = AccessoriesSchema.validate(req.body, { abortEarly: false });


        // If validation fails, return 400 with all validation errors
        if (error) {
            const validationErrors = error.details.map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: "Invalid Accessories data.",
                errors: validationErrors,
            });
        }




        // uppload accessories image to cloudinary

        const accessoriesImage = [];
        for (const imge of img) {
            try {
                const sinImage = await uploadAccessoriesFileToCloudinary(imge);
                accessoriesImage.push(sinImage);
            } catch (err) {
                console.error("Upload failed:", err);
            }
        }


        // Create user with hashed password
        const accessories = await Accessories.create({
            name,
            price,
            shortDes,
            description,
            img: accessoriesImage,
            productType
        });


        res.status(201).json({
            success: true,
            message: "Accessories Added successfully",
            data: accessories
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



/******************** updateAccessories Controller here ***********************/

const updateAccessories = async (req, res) => {
    try {

        const { id } = req.params;

        // Validate product ID format
        if (!id || id.length !== 24) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format.",
            });
        }




        const { name, price, description, shortDes, img, productType } = req.body;



        // uppload accessories image to cloudinary

        const accessoriesImage = [];
        for (const imge of img) {
            try {
                const sinImage = await uploadAccessoriesFileToCloudinary(imge);
                accessoriesImage.push(sinImage);
            } catch (err) {
                console.error("Upload failed:", err);
            }
        }


        const updateDataObject = {
            name: name,
            price: price,
            shortDes: shortDes,
            description: description,
            img: accessoriesImage,
            productType: productType
        };



        // Update the product
        const updatedProduct = await Accessories.findByIdAndUpdate(id, updateDataObject, {
            new: true, // return updated document
            runValidators: true, // enforce schema validation
        });



        //If not found
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }


        //Success response
        res.status(200).json({
            success: true,
            message: "Product updated successfully!",
            data: updatedProduct,
        });


    } catch (err) {
        console.error("Error updating product:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while updating the product.",
        });
    }

};





/******************** deleteAccessories Controller here ***********************/

const deleteAccessories = async (req, res) => {



    try {


        const { id } = req.params;


        // Validate product ID format
        if (!id || id.length !== 24) {
            return res.status(400).json({
                success: false,
                message: "Invalid accessories ID format.",
            });
        }



        // Attempt to delete the product
        const deletedCoupons = await Accessories.findByIdAndDelete(id);



        //If no product found
        if (!deletedCoupons) {
            return res.status(404).json({
                success: false,
                message: "Accessories not found.",
            });
        }



        //Success response
        res.status(200).json({
            success: true,
            message: "Accessories deleted successfully!",
            data: deletedCoupons,
        });


    } catch (err) {
        console.error("Error Accessories Coupon:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the Coupon.",
        });
    }


};







export { createAccessories, deleteAccessories, getAllAccessories, getSingleAccessories, updateAccessories };

