import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../config';
import prisma from '../utils/prisma';
import { UserRole } from '../../../generated/prisma';

type JWTPayload = JwtPayload & {
  email: string;
  userId: string;
};

export type AuthRequest = Request & {
  user?: { email: string; userId: string; role: UserRole };
};

const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Get token from cookie (website standard)
  const token = req.cookies.accessToken;
  
  if (!token) {
    res.status(401).json({ message: 'Unauthorized - No token provided' });
    return;
  }
  
  try {
    // Validate JWT secret exists
    if (!config.jwt.access_secret) {
      throw new Error('JWT access secret not configured');
    }

    const decoded = jwt.verify(token, config.jwt.access_secret as string) as unknown as JWTPayload;
    
    // Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: { 
        email: decoded.email,
        isActive: true 
      },
      select: { id: true, email: true, isActive: true, role: true }
    });

    if (!user) {
      res.status(401).json({ message: 'User not found or account deactivated' });
      return;
    }

    (req as AuthRequest).user = { 
      email: decoded.email, 
      userId: decoded.userId,
      role: user.role
    };
    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
};

// Add role-based authorization middleware
const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthRequest).user;
    
    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).json({ message: 'Access denied - Insufficient permissions' });
      return;
    }
    
    next();
  };
};

// Export middleware functions for different role requirements
export const requireAdmin = requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
export const requireSuperAdmin = requireRole([UserRole.SUPER_ADMIN]);

export default auth;
