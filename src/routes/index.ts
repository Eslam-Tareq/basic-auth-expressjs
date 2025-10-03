import { Express } from "express";
import authRouter from "./authRoutes";
import qrRouter from "./qrRoutes";

const mountRoutes = (app: Express) => {
  const prefixUrl = "/api/v1";
  app.use(prefixUrl + "/auth", authRouter);
  app.use(prefixUrl + "/qr", qrRouter);
};

export default mountRoutes;
