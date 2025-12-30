import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/UserModel";

declare global {
  namespace Express {
    interface Request {
      currentUser?: { id: number | null; role: UserRole };
    }
  }
}

export function attachUser(req: Request, _res: Response, next: NextFunction) {
  const idHeader = req.header("x-user-id");
  const roleHeader = req.header("x-user-role");

  const id = idHeader ? Number(idHeader) : null;
  const role: UserRole = roleHeader === "admin" ? "admin" : "user";

  req.currentUser = { id, role };
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.currentUser || !req.currentUser.id) {
    return res.status(401).json({ error: "Login required" });
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.currentUser || req.currentUser.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  next();
}
