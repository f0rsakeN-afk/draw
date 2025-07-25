import { User } from "@prisma/client";
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: User;
  file?: Express.Multer.File;
}

declare global {
  namespace Express {
    interface Request {
      user: User;
      file?: Express.Multer.File;
    }
  }
}
