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
import {
  getCurrentUUIDService,
  RegenerateCurrentUUIDService,
} from "../services/qrServices";

export const getCurrentUUID = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const qrCode = await getCurrentUUIDService(req.user?.id);
      res.status(200).json({
        success: true,
        qrCode,
      });
    } catch (err) {
      return next(err);
    }
  }
);

export const RegenerateCurrentUUID = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const qrCode = await RegenerateCurrentUUIDService(req.user?.id);
      res.status(200).json({
        success: true,
        qrCode,
      });
    } catch (err) {
      return next(err);
    }
  }
);
