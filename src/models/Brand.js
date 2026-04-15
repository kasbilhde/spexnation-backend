import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
    {
        brandName: {
            type: String,
            required: [true, "Brand name is required"],
            trim: true,
            minlength: [2, "Brand name must be at least 2 characters"],
            maxlength: [100, "Brand name cannot exceed 100 characters"],
        },
        forProduct: {
            type: String,
            required: [true, "For product is required"],
            trim: true,
        }
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

export default mongoose.models.Brand || mongoose.model("Brand", brandSchema);
