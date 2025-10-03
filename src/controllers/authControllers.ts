import { Request, Response, NextFunction } from "express";

import catchAsync from "express-async-handler";
import {
  forgetPasswordService,
  logInService,
  logOutService,
  resetPasswordService,
  signUpService,
} from "../services/authServices";
import {
  ForgetPasswordDto,
  logInDto,
  ResetPasswordDto,
  ResetTokenDictionary,
  signUpDto,
} from "../dtos/authDto";

export const signUp = catchAsync(
  async (
    req: Request<{}, {}, signUpDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await signUpService(req.body);
      res.cookie("accessToken", user.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.status(201).json({
        success: true,
        message: "User created successfully, please login again",
        user: user.user,
        accessToken: user.accessToken,
      });
    } catch (err) {
      return next(err);
    }
  }
);

export const logIn = catchAsync(
  async (req: Request<{}, {}, logInDto>, res: Response, next: NextFunction) => {
    try {
      const user = await logInService(req.body);
      res.cookie("accessToken", user.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.status(200).json({
        success: true,
        message: "logged in successfully",
        user: user.user,
        accessToken: user.accessToken,
      });
    } catch (err) {
      return next(err);
    }
  }
);

export const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    logOutService(req, res);
    res.status(200).json({
      success: true,
      message: "logged out successfully",
    });
  }
);

export const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        success: true,
        user: req.user,
      });
    } catch (err) {
      return next(err);
    }
  }
);

export const forgetPassword = catchAsync(
  async (
    req: Request<{}, {}, ForgetPasswordDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await forgetPasswordService(req.body);
      res.status(200).json({
        success: true,
        message: "reset email sent successfully",
      });
    } catch (err) {
      return next(err);
    }
  }
);

export const resetPassword = catchAsync(
  async (
    req: Request<ResetTokenDictionary, {}, ResetPasswordDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { passwordResetToken } = req.params;
      await resetPasswordService(req.body, passwordResetToken);
      res.status(200).json({
        success: true,
        message: "password reset successfully",
      });
    } catch (err) {
      return next(err);
    }
  }
);
