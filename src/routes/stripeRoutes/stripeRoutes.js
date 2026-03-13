import express from "express";
import stripeWebhook from "../../controllers/orderController/webhookController.js";

const router = express.Router();

/********* Import Here Controller Files **********/


router.get("/stripe-session", stripeWebhook);



export default router;
