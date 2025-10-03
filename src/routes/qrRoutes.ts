import express from "express";
import { protect } from "../services/authServices";
import { getCurrentUUID } from "../controllers/qrControllers";

const qrRouter = express.Router();

qrRouter.get("/current", protect, getCurrentUUID);

export default qrRouter;
