import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
const EXPIRES = process.env.JWT_EXPIRES;

if (!SECRET || !EXPIRES) {
  throw new Error("No JWT secret specified!!");
}

const JWT_SECRET = SECRET as string;
const JWT_EXPIRES = EXPIRES as string;

export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};