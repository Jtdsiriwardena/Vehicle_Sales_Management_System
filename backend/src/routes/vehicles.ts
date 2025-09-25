import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { upload } from "../utils/multer";
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  generateVehicleDescription
} from "../controllers/vehicleController";

const router = Router();

// Routes
router.post("/", authMiddleware, upload.array("images", 6), createVehicle);
router.get("/", getVehicles);
router.get("/:id", getVehicleById);
router.put("/:id", authMiddleware, upload.array("images", 6), updateVehicle);
router.delete("/:id", authMiddleware, deleteVehicle);
router.post("/generate-description", generateVehicleDescription);

export default router;
