import Product from "../../models/Product.js";
import { productQueue } from "../../queues/product.queue.js";
import uploadFilesToCloudinary from "../../utils/uploadFilesToCloudinary.js";
import productSchema from "../../validationSchema/productSchema.js";



/********** get all product controller is here **********/
const getAllProduct = async (req, res) => {


  try {


    // For each product, attach its reviews and reviewer info
    const product = await Product.find({}).sort({ createdAt: -1 }).lean();





    // Return response
    res.status(200).json({
      success: true,
      message: "Products fetched successfully!",
      data: product,
    });

  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching products.",
    });
  }


};





/********** get all bestselling product controller is here **********/
const bestsellingproduct = async (req, res) => {


  try {


    // For each product, attach its reviews and reviewer info
    const product = await Product.find({}).sort({ createdAt: -1 }).lean();



    const bestsellingProduct = product.filter((item) => {
      return item.isBestSelling === true && item.frameType === "Frame";
    });



    // Return response
    res.status(200).json({
      success: true,
      message: "Bestselling Products fetched successfully!",
      data: bestsellingProduct,
    });

  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching products.",
    });
  }


};





/********** get all product for mens controller is here **********/
const getAllProductMens = async (req, res) => {


  try {


    // For each product, attach its reviews and reviewer info
    const product = await Product.find({}).sort({ createdAt: -1 }).lean();


    const filterMensProduct = product.filter((item) => {
      return item.gender === "Mens" && item.frameType === "Frame";
    });


    // Return response
    res.status(200).json({
      success: true,
      message: "Products fetched successfully!",
      data: filterMensProduct,
    });

  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching products.",
    });
  }


};




/********** get all product for womens controller is here **********/
const getAllProductWomens = async (req, res) => {


  try {


    // For each product, attach its reviews and reviewer info
    const product = await Product.find({}).sort({ createdAt: -1 }).lean();



    const filterWomensProduct = product.filter((item) => {
      return item.gender === "Womens" && item.frameType === "Frame";
    });




    // Return response
    res.status(200).json({
      success: true,
      message: "Products fetched successfully!",
      data: filterWomensProduct,
    });

  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching products.",
    });
  }


};






/********** get all product controller is here **********/
const getAllProductSunglassess = async (req, res) => {


  try {


    // For each product, attach its reviews and reviewer info
    const product = await Product.find({}).sort({ createdAt: -1 }).lean();



    const filterSunglassesProduct = product.filter((item) => {
      return item.frameType === "Prescription Sunglasses" || item.frameType === "Non-Prescription Sunglasses";
    });



    // Return response
    res.status(200).json({
      success: true,
      message: "Products fetched successfully!",
      data: filterSunglassesProduct,
    });

  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching products.",
    });
  }


};









/********** get single product controller is here **********/
const getSingleProduct = async (req, res) => {

  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || id.length !== 24) {
      return res.status(400).json({ error: "Invalid product ID format." });
    }


    // Find product by ID
    const product = await Product.findById(id).lean();



    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }



    // Return the product
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({
      success: false,
      error: "Something went wrong while fetching the product!",
    });
  }

};










/********** create product controller is here **********/
const createProduct = async (req, res) => {


  try {


    // Validate body data using Joi schema
    const { error, value } = productSchema.validate(req.body, { abortEarly: false });


    // If validation fails, return 400 with all validation errors
    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      console.log(error);
      return res.status(400).json({
        success: false,
        message: "Invalid product data.",
        errors: validationErrors,
      });
    }


    // Send job to BullMQ queue
    const job = await productQueue.add("create-product", {
      productData: value
    }, {
      jobId: value.ProductTitle,
      removeOnComplete: true,
      removeOnFail: 5,
    });


    // Send success response
    res.status(201).json({
      success: true,
      //message: "Product created successfully!",
      // data: product,
      message: "Product is being processed. You will see it soon.",
      jobId: job.id,
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
const updateProduct = async (req, res) => {


  try {

    const { id } = req.params;

    // Validate product ID format
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format.",
      });
    }



    const { ProductTitle, brand, shortdes, product_price, gender, weight, meterial, fType, fShape, lensWidth, lensHeight, BridgeWidth, ArmLength, product_Discription, product_Images, sunglassesType } = req.body;


    const pt_Images = await uploadFilesToCloudinary(product_Images);

    const value = {
      ProductTitle,
      brand,
      sunglassesType,
      shortdes,
      product_price,
      gender,
      weight,
      meterial,
      fType,
      fShape,
      lensWidth,
      lensHeight,
      BridgeWidth,
      ArmLength,
      product_Discription,
      product_Images: pt_Images,
    };



    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(id, value, {
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




/********** Update  product controller is here **********/
const bestsellingupdateProduct = async (req, res) => {


  try {

    const { id } = req.params;

    // Validate product ID format
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format.",
      });
    }



    const { isBestSelling } = req.body;




    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(id, { isBestSelling: isBestSelling }, {
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









/********** Delete  product controller is here **********/
const deleteProduct = async (req, res) => {


  try {


    const { id } = req.params;

    // Validate product ID format
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format.",
      });
    }



    // Attempt to delete the product
    const deletedProduct = await Product.findByIdAndDelete(id);



    //If no product found
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }



    //Success response
    res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
      data: deletedProduct,
    });


  } catch (err) {
    console.error("Error deleting product:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the product.",
    });
  }


};









/*********** modules export from here ************/
export { bestsellingproduct, bestsellingupdateProduct, createProduct, deleteProduct, getAllProduct, getAllProductMens, getAllProductSunglassess, getAllProductWomens, getSingleProduct, updateProduct };

