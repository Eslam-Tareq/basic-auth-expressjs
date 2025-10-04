import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/appError";
import catchAsync from "express-async-handler";
import { createAccessToken, verifyTokenAsync } from "../utils/jwt";
import { mongoId, userDocument } from "../types/documentTypes";
import { hashingPassword, isCorrectPassword } from "../utils/password";
import {
  ForgetPasswordDto,
  logInDto,
  ResetPasswordDto,
  signUpDto,
} from "../dtos/authDto";
import crypto from "crypto";
import { sendMail } from "../config/email";
import { generateUniqueUUID } from "./qrServices";
export const signUpService = async (body: signUpDto) => {
  const { name, email, password, phone } = body;
  // hashing password before saving it in data base

  const hashedPassword = await hashingPassword(password);
  const qrCode = generateUniqueUUID(email);
  //1- create user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    qrCode,
  });
  //2- create access token for user
  const accessToken = createAccessToken(newUser.id);
  return { user: newUser, accessToken };
};

export const logInService = async (body: logInDto) => {
  //1- find user by email
  const { email, password } = body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("email or password is incorrect", 400);
  }
  if (!user.password) {
    throw new AppError("email or password is incorrect", 400);
  }
  //2- checking password correction
  const isPassCorrect = await isCorrectPassword(password, user.password);
  if (!isPassCorrect) {
    throw new AppError("email or password is incorrect", 400);
  }
  const accessToken = createAccessToken(user.id);

  return { user, accessToken };
};

export const protect = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      let token: string;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      } else {
        token = req.cookies.accessToken;
      }
      if (!token) {
        throw new AppError("there is no access token", 401);
      }

      const decoded = (await verifyTokenAsync(token, "access")) as JwtPayload;
      const userId = decoded!.userId;
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError("user belong to that token does not exist", 401);
      }

      req.user = user; // for letting user to use protected routes

      return next();
    } catch (err) {
      if ((err as Error).message === "jwt expired") {
        return next(new AppError("Expired access token", 401));
      }
      return next(err);
    }
  }
);

export const logOutService = async (req: Request, res: Response) => {
  req.headers.authorization = "";

  res.clearCookie("accessToken");
};

export const forgetPasswordService = async (body: ForgetPasswordDto) => {
  const { email } = body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("there is no user belong to this email", 404);
  }
  try {
    const passwordResetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 minutes
    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = new Date(passwordResetExpires);
    await user.save({ validateBeforeSave: false });
    //send email to user containig reset link
    await sendMail({
      email: user.email,
      subject: "your password reset token (valid for 10 minutes)",
      message: `forget your password? submit a patch request with your new password and passwordConfirm to: 
      ${process.env.FRONTEND_PASSWORD_RESET_URL}/${passwordResetToken}
      if you didn't forget your password, please ignore this email!`,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError(
      "there was an error sending the email. try again later",
      400
    );
  }
};

export const resetPasswordService = async (
  body: ResetPasswordDto,
  passwordResetToken: string
) => {
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gte: Date.now() },
  });
  if (!user) {
    throw new AppError("token is invalid or has expired", 400);
  }
  const { newPassword } = body;
  user.password = await hashingPassword(newPassword);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
};

export const getCurrentUserService = async (userId: mongoId) => {
  const user = await User.findById(userId);
  return user;
};
