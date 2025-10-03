import e from "express";
import { IUser } from "../models/userModel";

export interface signUpDto
  extends Pick<IUser, "name" | "email" | "password" | "phone"> {}

export interface logInDto extends Pick<IUser, "email" | "password"> {}

export interface ForgetPasswordDto extends Pick<IUser, "email"> {}

export interface ResetPasswordDto {
  newPassword: string;
  newPasswordConfirm: string;
}

export type ResetTokenDictionary = {
  passwordResetToken: string;
};
