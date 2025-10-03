import express from "express";
import { getMe, logIn, logOut, signUp } from "../controllers/authControllers";
import { protect } from "../services/authServices";
import { signUpValidator } from "../middlewares/validators/auth.validator";
const authRouter = express.Router();

authRouter.post("/signup", signUpValidator, signUp);

authRouter.post("/logIn", logIn);
authRouter.post("/logout", protect, logOut);

authRouter.get("/getMe", protect, getMe);

export default authRouter;
