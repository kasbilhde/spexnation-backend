import express from "express";
import { adminDeshboard ,myDeshboard} from "../../controllers/adminController/adminController.js";
import { authorize, protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/deshboard", protect, authorize("admin"), adminDeshboard);
router.get("/deshboard/:id", protect, authorize("user"), myDeshboard);


export default router;