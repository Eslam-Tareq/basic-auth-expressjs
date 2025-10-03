import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { mongoId } from "../types/documentTypes";

export const createAccessToken = (payload: mongoId) => {
  const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m";
  const options: SignOptions = {
    expiresIn: expiresIn as any,
  };

  return jwt.sign(
    { userId: payload },
    process.env.JWT_ACCESS_TOKEN_SECRET as string,
    options
  );
};
export const verifyTokenAsync = async (
  token: string,
  tokenType: "access" | "refresh"
) => {
  const secret =
    tokenType == "access"
      ? process.env.JWT_ACCESS_TOKEN_SECRET!
      : process.env.JWT_REFRESH_TOKEN_SECRET!;
  return await new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};
