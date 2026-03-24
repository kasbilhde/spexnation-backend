import express from "express";
import { addbanner, allbanner, deletebanner } from "../../controllers/bannarController/bannarController.js";
import { authorize, protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

/********* Import Here Controller Files **********/


router.get("/allbanner", allbanner);
router.post("/addbanner", protect, authorize("admin"), addbanner);
// router.put("/updateaccessories/:id", protect, authorize("admin"), updateAccessories);
router.delete("/deletebanner/:id", protect, authorize("admin"), deletebanner);


export default router;
