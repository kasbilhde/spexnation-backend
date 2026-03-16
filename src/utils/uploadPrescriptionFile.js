import { cloudinary } from "../config/cloudinary.js";


const uploadPrescriptionFile = async (bodyData) => {


    try {

        const itemsData = bodyData?.items;

        if (!itemsData) return bodyData;

        const updatedItems = await Promise.all(
            itemsData.map(async (item) => {

                if (item?.type !== "Frame") {
                    return item;
                }

                const prescriptionImage = item?.AllLensInfo?.prescriptionImage;

                if (!prescriptionImage) {
                    return item;
                }

                const result = await cloudinary.uploader.upload(prescriptionImage, {
                    folder: "spexnation",
                    resource_type: "auto",
                });

                return {
                    ...item,
                    AllLensInfo: {
                        ...item.AllLensInfo,
                        prescriptionImage: result.secure_url
                    }
                };
            })
        );

        return {
            ...bodyData,
            items: updatedItems
        };

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return bodyData;
    }




};

export default uploadPrescriptionFile;