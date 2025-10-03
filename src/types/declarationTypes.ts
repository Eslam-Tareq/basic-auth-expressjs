import { userDocument } from "./documentTypes";

export interface PublicObject {
  [key: string]: any;
}

declare global {
  namespace Express {
    interface Request {
      user?: userDocument;
    }
  }
}
