import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

interface JWTPayload {
  userId: string;
}

export const generateToken = (userId: Types.ObjectId): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET n\'est pas défini');
  }

  const payload = { userId: userId.toString() };
  const expire = process.env.JWT_EXPIRE || '7d';

  // @ts-ignore - Ignorer l'erreur de type pour expiresIn
  return jwt.sign(payload, secret, { expiresIn: expire });
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET n\'est pas défini');
    }

    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
