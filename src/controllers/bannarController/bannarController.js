import Banner from "../../models/Banner.js";
import uploadAccessoriesFileToCloudinary from "../../utils/uploadAccessoriesFileToCloudinary.js";







/********** get all getAllAccessories controller here **************/
const allbanner = async (req, res) => {

    try {
        const users = await Banner.find();
        res.json({
            success: true,
            message: "All Banner fetched successfully",
            data: users
        });

    } catch (error) {
        res.status(500).json({ message: "There was a Server Error" });
    }
}






/********************  User registration Controller here ***********************/
const addbanner = async (req, res) => {


    try {


        // Validate body data using Joi schema
        const { Route, img, productType } = req.body;


        // uppload accessories image to cloudinary
        const bannerImage = await uploadAccessoriesFileToCloudinary(img);


        // Create user with hashed password
        const banners = await Banner.create({
            Route,
            img: bannerImage,
            productType
        });


        res.status(201).json({
            success: true,
            message: "Banner Added successfully",
            data: banners
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



/******************** updateAccessories Controller here ***********************/

// const updateAccessories = async (req, res) => {
//     try {

//         const { id } = req.params;

//         // Validate product ID format
//         if (!id || id.length !== 24) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid product ID format.",
//             });
//         }




//         const { name, price, description, img, productType } = req.body;
//         // uppload accessories image to cloudinary
//         const accessoriesImage = await uploadAccessoriesFileToCloudinary(img);

//         const updateDataObject = {
//             name: name,
//             price: price,
//             description: description,
//             img: accessoriesImage,
//             productType: productType
//         };



//         // Update the product
//         const updatedProduct = await Accessories.findByIdAndUpdate(id, updateDataObject, {
//             new: true, // return updated document
//             runValidators: true, // enforce schema validation
//         });



//         //If not found
//         if (!updatedProduct) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found.",
//             });
//         }


//         //Success response
//         res.status(200).json({
//             success: true,
//             message: "Product updated successfully!",
//             data: updatedProduct,
//         });


//     } catch (err) {
//         console.error("Error updating product:", err.message);
//         res.status(500).json({
//             success: false,
//             message: "Something went wrong while updating the product.",
//         });
//     }

// };






/******************** deleteAccessories Controller here ***********************/

const deletebanner = async (req, res) => {



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
        const deletedbanner = await Banner.findByIdAndDelete(id);



        //If no product found
        if (!deletedbanner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found.",
            });
        }



        //Success response
        res.status(200).json({
            success: true,
            message: "Banner deleted successfully!",
            data: deletedbanner,
        });


    } catch (err) {
        console.error("Error Banner Coupon:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the Coupon.",
        });
    }


};







export { addbanner, allbanner, deletebanner };

