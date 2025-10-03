import * as mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshTokens: string[];
  qrCode: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    name: String,
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: String,

    passwordResetToken: String,
    passwordResetExpires: Date,
    qrCode: {
      type: String,
      unique: true,
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
