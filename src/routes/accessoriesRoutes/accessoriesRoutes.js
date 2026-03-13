import express from "express";
import { createAccessories, deleteAccessories, getAllAccessories, updateAccessories } from "../../controllers/accessoriesControllers/accessoriesControllers.js";
import { authorize, protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

/********* Import Here Controller Files **********/


router.get("/allaccessories", getAllAccessories);
router.post("/addaccessories", protect, authorize("admin"), createAccessories);
router.put("/updateaccessories/:id", protect, authorize("admin"), updateAccessories);
router.delete("/deleteaccessories/:id", protect, authorize("admin"), deleteAccessories);


export default router;
