import express from "express";
import {
  forgetPassword,
  getMe,
  logIn,
  logOut,
  resetPassword,
  signUp,
} from "../controllers/authControllers";
import { protect } from "../services/authServices";
import {
  forgetPasswordValidator,
  resetPasswordValidator,
  signUpValidator,
} from "../middlewares/validators/auth.validator";
const authRouter = express.Router();

authRouter.post("/register", signUpValidator, signUp);

authRouter.post("/login", logIn);
authRouter.post("/logout", protect, logOut);
authRouter.post("/forget-password", forgetPasswordValidator, forgetPassword);
authRouter.put(
  "/reset-password/:passwordResetToken",
  resetPasswordValidator,
  resetPassword
);
authRouter.get("/me", protect, getMe);
authRouter.get("/qrcode", protect, getMe);

export default authRouter;
