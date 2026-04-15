import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Color name is required"],
            trim: true,
            minlength: [2, "Color name must be at least 2 characters"],
            maxlength: [100, "Color name cannot exceed 100 characters"],
        },
        value: {
            type: String,
            required: [true, "Color value is required"],
            trim: true,
            minlength: [3, "Color value must be at least 3 characters"],
            maxlength: [7, "Color value cannot exceed 7 characters"],
        }
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

export default mongoose.models.Color || mongoose.model("Color", colorSchema);
