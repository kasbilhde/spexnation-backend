import mongoose from "mongoose";

const bannersSchema = new mongoose.Schema(
    {
        Route: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [100, "Name cannot exceed 100 characters"],
        },


        img: {
            type: String,
            required: [true, "Image is required"],
            trim: true,
        },

        smallimg: {
            type: String,
            required: [true, "Small Image is required"],
            trim: true,
        },

        productType: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

export default mongoose.models.Banner || mongoose.model("Banner", bannersSchema);
