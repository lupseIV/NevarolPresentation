import { Request, Response, NextFunction } from 'express';

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    isAdmin?: boolean;
    cart?: {
      items: Array<{
        productId: number;
        quantity: number;
      }>;
    };
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId || !req.session.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
