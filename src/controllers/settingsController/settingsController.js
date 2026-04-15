import Brand from "../../models/Brand.js";
import Color from "../../models/Color.js";



/********** get all settings controller is here **********/
const getSettings = async (req, res) => {


    try {


        // find all the colour and brand from the database
        const colours = await Color.find({}).sort({ createdAt: -1 }).lean();
        const brands = await Brand.find({}).sort({ createdAt: -1 }).lean();


        const responseData = {
            colours,
            brands,
        };


        // Return response
        res.status(200).json({
            success: true,
            message: "Products fetched successfully!",
            data: responseData,
        });

    } catch (error) {
        console.error("Error fetching products:", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching products.",
        });
    }


};



/********** add colour controller is here **********/
const addColour = async (req, res) => {


    try {


        const { name, value } = req.body;


        // store in the database
        const clrs = await Color.create({
            name,
            value
        });


        // Send success response
        res.status(201).json({
            success: true,
            message: "Colour created successfully!",
            data: clrs,
        });

    } catch (err) {
        console.error("Error creating colour:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while creating the colour.",
        });
    }

};



/********** add brand controller is here **********/
const addBrand = async (req, res) => {


    try {


        const { brandName, forProduct } = req.body;


        // store in the database
        const bnds = await Brand.create({
            brandName,
            forProduct
        });


        // Send success response
        res.status(201).json({
            success: true,
            message: "Brand created successfully!",
            data: bnds,
        });

    } catch (err) {
        console.error("Error creating brand:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while creating the brand.",
        });
    }

};


/********** Delete  colour controller is here **********/
const deleteColour = async (req, res) => {


    try {


        const { id } = req.params;

        // Validate product ID format
        if (!id || id.length !== 24) {
            return res.status(400).json({
                success: false,
                message: "Invalid color ID format.",
            });
        }



        // Attempt to delete the product
        const deletedProduct = await Color.findByIdAndDelete(id);



        //If no product found
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Color not found.",
            });
        }



        //Success response
        res.status(200).json({
            success: true,
            message: "Color deleted successfully!",
            data: deletedProduct,
        });


    } catch (err) {
        console.error("Error deleting color:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the color.",
        });
    }


};



/********** Delete  brand controller is here **********/
const deleteBrand = async (req, res) => {


    try {


        const { id } = req.params;

        // Validate product ID format
        if (!id || id.length !== 24) {
            return res.status(400).json({
                success: false,
                message: "Invalid brand ID format.",
            });
        }



        // Attempt to delete the brand
        const deletedBrand = await Brand.findByIdAndDelete(id);



        //If no brand found
        if (!deletedBrand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found.",
            });
        }



        //Success response
        res.status(200).json({
            success: true,
            message: "Brand deleted successfully!",
            data: deletedBrand,
        });


    } catch (err) {
        console.error("Error deleting brand:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the brand.",
        });
    }


};



/*********** modules export from here ************/
export { addBrand, addColour, deleteBrand, deleteColour, getSettings };

