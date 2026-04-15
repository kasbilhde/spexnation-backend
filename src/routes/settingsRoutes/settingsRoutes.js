import express from "express";
import { addBrand, addColour, deleteBrand, deleteColour, getSettings } from '../../controllers/settingsController/settingsController.js';
import { authorize, protect } from "../../middlewares/authMiddleware.js";


const router = express.Router();



router.get("/settings", getSettings);

router.post("/settings/addbrand", protect, authorize("admin"), addBrand);

router.post("/settings/addcolour", protect, authorize("admin"), addColour);

router.delete("/settings/deletebrand/:id", protect, authorize("admin"), deleteBrand);

router.delete("/settings/deletecolour/:id", protect, authorize("admin"), deleteColour);



export default router;