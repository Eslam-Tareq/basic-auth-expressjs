import express from "express";
import { protect } from "../services/authServices";
import {
  getCurrentUUID,
  RegenerateCurrentUUID,
} from "../controllers/qrControllers";

const qrRouter = express.Router();

qrRouter.get("/current", protect, getCurrentUUID);
qrRouter.post("/regenerate", protect, RegenerateCurrentUUID);

export default qrRouter;
