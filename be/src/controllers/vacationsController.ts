import { Router, Request, Response } from "express";
import {
  getVacations,
  createVacation,
  updateVacation,
  deleteVacation,
  followVacation,
  unfollowVacation,
  VacationFilter,
} from "../services/vacationsService";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware";

const router = Router();

// GET /vacations?page=1&filter=upcoming|active|followed
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const filter = (req.query.filter as VacationFilter) || null;
    const userId = req.currentUser?.id ?? null;

    const result = await getVacations(page, 10, filter, userId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// POST /vacations (admin)
router.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { destination, description, start_date, end_date, price, image_name } = req.body;

    await createVacation({
      destination,
      description,
      startDate: start_date,
      endDate: end_date,
      price,
      imageName: image_name,
    });

    res.status(201).json({ message: "Vacation created" });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Create failed" });
  }
});

// PUT /vacations/:id (admin)
router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { destination, description, start_date, end_date, price, image_name } = req.body;

    await updateVacation(id, {
      destination,
      description,
      startDate: start_date,
      endDate: end_date,
      price,
      imageName: image_name,
    });

    res.json({ message: "Vacation updated" });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Update failed" });
  }
});

// DELETE /vacations/:id (admin)
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteVacation(id);
    res.json({ message: "Vacation deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Delete failed" });
  }
});

// POST /vacations/:id/follow (user)
router.post("/:id/follow", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser!.id!;
    const vacationId = Number(req.params.id);
    await followVacation(userId, vacationId);
    res.json({ message: "Followed" });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Follow failed" });
  }
});

// DELETE /vacations/:id/follow (user)
router.delete("/:id/follow", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser!.id!;
    const vacationId = Number(req.params.id);
    await unfollowVacation(userId, vacationId);
    res.json({ message: "Unfollowed" });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Unfollow failed" });
  }
});

export default router;
