import { Router, Request, Response } from "express";
import { runQuery } from "../dal/dal";

const router = Router();

// simple email regex just to check format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Email is not valid" });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: "Password must be at least 4 characters" });
    }

    // check if email already exists
    const existing = (await runQuery(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )) as any[];

    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // insert user as regular user
    await runQuery(
      "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, 'user')",
      [firstName, lastName, email, password]
    );

    // get created user (for FE)
    const rows = (await runQuery(
      "SELECT id, first_name, last_name, email, role FROM users WHERE email = ?",
      [email]
    )) as any[];

    const user = rows[0];

    res.json({ user });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const rows = (await runQuery(
      "SELECT id, first_name, last_name, email, password, role FROM users WHERE email = ?",
      [email]
    )) as any[];

    const user = rows[0];

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Wrong email or password" });
    }

    // Don’t send password back to client
    delete user.password;

    res.json({ user });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
