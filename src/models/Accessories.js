import mongoose from "mongoose";

const accessoriesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [100, "Name cannot exceed 100 characters"],
        },

        price: {
            type: Number,
            default: 0,
            required: true
        },

        shortDes: {
            type: String,
            required: [true, "Short description is required"],
            trim: true,
            minlength: [1, "Short description should be at least 1 characters"],
        },

        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            minlength: [5, "Description should be at least 5 characters"],
        },

        img: {
            type: Array,
            required: true
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

export default mongoose.models.Accessories || mongoose.model("Accessories", accessoriesSchema);
