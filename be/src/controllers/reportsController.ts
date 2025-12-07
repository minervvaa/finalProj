// src/controllers/reportsController.ts
import { Router, Request, Response } from "express";
import { runQuery } from "../dal/dal";

const router = Router();

// helper: get current user from headers
function getCurrentUser(req: Request) {
  const userIdHeader = req.header("x-user-id");
  const roleHeader = req.header("x-user-role");

  const id = userIdHeader ? Number(userIdHeader) : null;
  const role = roleHeader === "admin" ? "admin" : "user";

  return { id, role };
}

// GET /reports/followers  (admin only)
// returns JSON: [{ destination, followers }]
router.get("/followers", async (req: Request, res: Response) => {
  try {
    const { role } = getCurrentUser(req);
    if (role !== "admin") {
      return res.status(403).json({ error: "Admin only" });
    }

    const rows = (await runQuery(
      `
      SELECT 
        v.destination AS destination,
        COUNT(f.id) AS followers
      FROM vacations v
      LEFT JOIN followers f ON v.id = f.vacation_id
      GROUP BY v.id
      ORDER BY v.destination ASC
      `
    )) as any[];

    res.json(rows);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /reports/followers.csv  (admin only)
// returns CSV file: destination,followers
router.get("/followers.csv", async (req: Request, res: Response) => {
  try {
    const { role } = getCurrentUser(req);
    if (role !== "admin") {
      return res.status(403).json({ error: "Admin only" });
    }

    const rows = (await runQuery(
      `
      SELECT 
        v.destination AS destination,
        COUNT(f.id) AS followers
      FROM vacations v
      LEFT JOIN followers f ON v.id = f.vacation_id
      GROUP BY v.id
      ORDER BY v.destination ASC
      `
    )) as any[];

    // build CSV text
    let csv = "destination,followers\n";
    for (const row of rows) {
      // simple escaping: wrap destination in quotes
      const dest = String(row.destination).replace(/"/g, '""');
      const followers = Number(row.followers) || 0;
      csv += `"${dest}",${followers}\n`;
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="vacations-followers.csv"'
    );

    res.send(csv);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
