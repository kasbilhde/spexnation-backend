import Joi from "joi";

const AccessoriesSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "Name is required.",
            "string.min": "Name must be at least 2 characters.",
        }),

    price: Joi.number()
        .min(1)
        .required()
        .messages({
            "string.empty": "Price is required.",
            "string.min": "Price should be at least 1 characters.",
        }),
    description: Joi.string()
        .trim()
        .min(5)
        .required()
        .messages({
            "string.empty": "Accessories Discriptions is required.",
            "string.min": "Accessories Discriptions should be at least 5 characters.",
        }),

    img: Joi.array()
        .required()
        .messages({
            "array.empty": "Image is required.",
        }),

    productType: Joi.string()
        .trim()
        .required()
});

export default AccessoriesSchema;
