// src/controllers/vacationsController.ts
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

// GET /vacations?page=1&filter=followed|upcoming|active
router.get("/", async (req: Request, res: Response) => {
  try {
    const { id: currentUserId } = getCurrentUser(req);

    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const offset = (page - 1) * pageSize;
    const filter = (req.query.filter as string) || null;

    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    const whereClauses: string[] = [];
    const whereParams: any[] = [];

    // filters according to spec
    if (filter === "upcoming") {
      // vacations that did not start yet
      whereClauses.push("date(v.start_date) > date(?)");
      whereParams.push(today);
    } else if (filter === "active") {
      // vacations that are currently active
      whereClauses.push("date(v.start_date) <= date(?) AND date(v.end_date) >= date(?)");
      whereParams.push(today, today);
    } else if (filter === "followed" && currentUserId) {
      // vacations the current user follows
      whereClauses.push(
        "EXISTS (SELECT 1 FROM followers f2 WHERE f2.vacation_id = v.id AND f2.user_id = ?)"
      );
      whereParams.push(currentUserId);
    }

    const whereSql = whereClauses.length ? "WHERE " + whereClauses.join(" AND ") : "";

    // total count for pagination
    const countRows = (await runQuery(
      `SELECT COUNT(*) AS total FROM vacations v ${whereSql}`,
      whereParams
    )) as any[];
    const total = countRows[0]?.total ?? 0;

    // list vacations with follower count + isFollowed
    const dataSql = `
      SELECT
        v.*,
        COUNT(f.id) AS followersCount,
        CASE
          WHEN ${currentUserId ? "EXISTS (SELECT 1 FROM followers fx WHERE fx.vacation_id = v.id AND fx.user_id = ?)" : "0"}
          THEN 1 ELSE 0
        END AS isFollowed
      FROM vacations v
      LEFT JOIN followers f ON v.id = f.vacation_id
      ${whereSql}
      GROUP BY v.id
      ORDER BY date(v.start_date) ASC
      LIMIT ? OFFSET ?
    `;

    const dataParams: any[] = [];
    if (currentUserId) dataParams.push(currentUserId);
    dataParams.push(...whereParams, pageSize, offset);

    const vacations = (await runQuery(dataSql, dataParams)) as any[];

    res.json({ vacations, total, page, pageSize });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /vacations  (admin only)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { role } = getCurrentUser(req);
    if (role !== "admin") return res.status(403).json({ error: "Admin only" });

    const { destination, description, start_date, end_date, price, image_name } = req.body;

    if (!destination || !description || !start_date || !end_date || price == null || !image_name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0 || numericPrice > 10000) {
      return res.status(400).json({ error: "Price must be between 0 and 10,000" });
    }

    const today = new Date().toISOString().slice(0, 10);

    if (start_date < today) {
      return res.status(400).json({ error: "Start date cannot be in the past" });
    }

    if (end_date < start_date) {
      return res.status(400).json({ error: "End date cannot be before start date" });
    }

    await runQuery(
      `INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [destination, description, start_date, end_date, numericPrice, image_name]
    );

    res.status(201).json({ message: "Vacation created" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /vacations/:id  (admin only)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { role } = getCurrentUser(req);
    if (role !== "admin") return res.status(403).json({ error: "Admin only" });

    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    const { destination, description, start_date, end_date, price, image_name } = req.body;

    if (!destination || !description || !start_date || !end_date || price == null || !image_name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0 || numericPrice > 10000) {
      return res.status(400).json({ error: "Price must be between 0 and 10,000" });
    }

    // In edit: allowed to change past vacations, but end_date must be after start_date.
    if (end_date < start_date) {
      return res.status(400).json({ error: "End date cannot be before start date" });
    }

    await runQuery(
      `UPDATE vacations
       SET destination = ?, description = ?, start_date = ?, end_date = ?, price = ?, image_name = ?
       WHERE id = ?`,
      [destination, description, start_date, end_date, numericPrice, image_name, id]
    );

    res.json({ message: "Vacation updated" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /vacations/:id  (admin only)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { role } = getCurrentUser(req);
    if (role !== "admin") return res.status(403).json({ error: "Admin only" });

    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    await runQuery(`DELETE FROM vacations WHERE id = ?`, [id]);
    // followers rows will be deleted by ON DELETE CASCADE

    res.json({ message: "Vacation deleted" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /vacations/:id/follow
router.post("/:id/follow", async (req: Request, res: Response) => {
  try {
    const { id: currentUserId } = getCurrentUser(req);
    if (!currentUserId) return res.status(401).json({ error: "Login required" });

    const vacationId = Number(req.params.id);
    if (!vacationId) return res.status(400).json({ error: "Invalid id" });

    await runQuery(
      `INSERT OR IGNORE INTO followers (user_id, vacation_id)
       VALUES (?, ?)`,
      [currentUserId, vacationId]
    );

    res.json({ message: "Followed" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /vacations/:id/follow
router.delete("/:id/follow", async (req: Request, res: Response) => {
  try {
    const { id: currentUserId } = getCurrentUser(req);
    if (!currentUserId) return res.status(401).json({ error: "Login required" });

    const vacationId = Number(req.params.id);
    if (!vacationId) return res.status(400).json({ error: "Invalid id" });

    await runQuery(
      `DELETE FROM followers WHERE user_id = ? AND vacation_id = ?`,
      [currentUserId, vacationId]
    );

    res.json({ message: "Unfollowed" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
