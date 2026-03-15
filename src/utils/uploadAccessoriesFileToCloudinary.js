import { cloudinary } from "../config/cloudinary.js";



const uploadAccessoriesFileToCloudinary = async (img) => {

    try {
        if (!img) return null;

        const result = await cloudinary.uploader.upload(img, {
            folder: "spexnation",
            resource_type: "auto", // supports pdf, image, etc.
        });

        return result.secure_url;

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return null;
    }
};

export default uploadAccessoriesFileToCloudinary;