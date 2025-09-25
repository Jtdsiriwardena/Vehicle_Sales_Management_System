import { Router } from "express";
import { authMiddleware } from "../middleware/auth";

import {
  vehiclesAdded,
  countByBrand,
  countByType,
  countByPriceRange
} from "../controllers/analyticsController";

const router = Router();

router.get("/vehicles-added", authMiddleware, vehiclesAdded);
router.get("/count-by-brand", authMiddleware,  countByBrand);
router.get("/count-by-type",authMiddleware,  countByType);
router.get("/count-by-price-range", authMiddleware, countByPriceRange);

export default router;
