import { v5 as uuidv5 } from "uuid";

import User from "../models/userModel";
import { mongoId } from "../types/documentTypes";

export const generateUniqueUUID = (name: string) => {
  const namespace = `6ba7b810-9dad-11d1-80b4-00c04fd430c8`;
  const randomName = name + `${Math.random()}` + Date.now();
  const uuid = uuidv5(randomName, namespace);
  return uuid;
};

export const getCurrentUUIDService = async (userId: string) => {
  const user = await User.findById(userId);
  return user?.qrCode;
};

export const RegenerateCurrentUUIDService = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("user not found");
  const newUUID = generateUniqueUUID(user.email);
  user.qrCode = newUUID;
  await user.save();
  return newUUID;
};
