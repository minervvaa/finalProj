import { Router, Request, Response } from "express";
import { requireAdmin } from "../middleware/authMiddleware";
import { getFollowersReport, getFollowersCsv } from "../services/reportsService";

const router = Router();


// JSON for chart
router.get("/followers", requireAdmin, async (_req: Request, res: Response) => {
  //TODO check it in postman or chrom
  
  try {
    // call (getFollowersReport from service) to get the destination + followers count
    const rows = await getFollowersReport();
    res.json(rows);

   // catching any server error, if there is a problem -> return status 500
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// CSV for download (same report but as a CSV file)
router.get("/followers.csv", requireAdmin, async (_req: Request, res: Response) => {
  //TODO check it in postman or chrom

  try {
    
    // call (getFollowersCsv from service) to build the CSV string
    const csv = await getFollowersCsv();

    // setting response headers so the browser knows it's a CSV file
    res.setHeader("Content-Type", "text/csv");

    // forcing download with a filename
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="vacations-followers.csv"'
    );
    // sending the CSV text as the response body
    res.send(csv);

   // catching any server error, if there is a problem -> return status 500
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Server error" });
  }
});

export default router;
