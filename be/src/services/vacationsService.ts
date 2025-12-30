import { runQuery } from "../dal/dal";
import { Vacation, mapVacationRow } from "../models/VacationModel";
import { todayISO } from "../utils/dateUtils";

export type VacationFilter = "followed" | "upcoming" | "active" | null;

export interface VacationListResult {
  vacations: Vacation[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getVacations(
  // defining the input types for pagination + filtering 
  page: number,
  pageSize: number,
  filter: VacationFilter,
  currentUserId: number | null

): Promise<VacationListResult> {

    const PAGE_SIZE = 14;
  pageSize = PAGE_SIZE;                 

  const offset = (page - 1) * pageSize;
  // getting today's date in ISO format (used for upcoming/active filters)
  const today = todayISO();

  const whereClauses: string[] = [];
  const whereParams: any[] = [];
   
 // for upcoming vacations -> vacations that start after today 
  if (filter === "upcoming") {
    whereClauses.push("date(v.start_date) > date(?)");
    whereParams.push(today);

 // for active vacations -> vacations happening right now 
  } else if (filter === "active") {
    whereClauses.push("date(v.start_date) <= date(?) AND date(v.end_date) >= date(?)");
    whereParams.push(today, today);

// for followed vacations -> vacations that the current user follows (only if we have currentUserId)
  } else if (filter === "followed" && currentUserId) {
    whereClauses.push(
      "EXISTS (SELECT 1 FROM followers f2 WHERE f2.vacation_id = v.id AND f2.user_id = ?)"
    );
    whereParams.push(currentUserId);
  }

  const whereSql = whereClauses.length ? "WHERE " + whereClauses.join(" AND ") : "";

  const countRows = (await runQuery(
    `SELECT COUNT(*) AS total FROM vacations v ${whereSql}`,
    whereParams
  )) as any[];
  const total = countRows[0]?.total ?? 0;

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

  const rows = (await runQuery(dataSql, dataParams)) as any[];
  const vacations = rows.map(mapVacationRow);

  return { vacations, total, page, pageSize };
}

export async function createVacation(v: Vacation): Promise <void> {
  if (!v.destination || !v.description || !v.startDate || !v.endDate || v.price == null || !v.imageName) {
    throw new Error("All fields are required");
  }

  const price = Number(v.price);
  if (isNaN(price) || price < 0 || price > 10000) {
    throw new Error("Price must be between 0 and 10,000");
  }

  const today = todayISO();

  if (v.startDate < today) {
    throw new Error("Start date cannot be in the past");
  }

  if (v.endDate < v.startDate) {
    throw new Error("End date cannot be before start date");
  }

  await runQuery(
    `INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [v.destination, v.description, v.startDate, v.endDate, price, v.imageName]
  );
}

export async function updateVacation(id: number, v: Vacation): Promise <void> {
  if (!id) throw new Error("Invalid id");

  if (!v.destination || !v.description || !v.startDate || !v.endDate || v.price == null || !v.imageName) {
    throw new Error("All fields are required");
  }

  const price = Number(v.price);
  if (isNaN(price) || price < 0 || price > 10000) {
    throw new Error("Price must be between 0 and 10,000");
  }

  if (v.endDate < v.startDate) {
    throw new Error("End date cannot be before start date");
  }

  await runQuery(
    `UPDATE vacations
     SET destination = ?, description = ?, start_date = ?, end_date = ?, price = ?, image_name = ?
     WHERE id = ?`,
    [v.destination, v.description, v.startDate, v.endDate, price, v.imageName, id]
  );
}

export async function deleteVacation(id: number): Promise <void> {
  if (!id) throw new Error("Invalid id");

  await runQuery("DELETE FROM vacations WHERE id = ?", [id]);
}

export async function followVacation(userId: number, vacationId: number): Promise <void> {
  if (!userId) throw new Error("Login required");
  if (!vacationId) throw new Error("Invalid vacation id");

  await runQuery(
    `INSERT OR IGNORE INTO followers (user_id, vacation_id) VALUES (?, ?)`,
    [userId, vacationId]
  );
}

export async function unfollowVacation(userId: number, vacationId: number): Promise <void> {
  if (!userId) throw new Error("Login required");
  if (!vacationId) throw new Error("Invalid vacation id");

  await runQuery(
    `DELETE FROM followers WHERE user_id = ? AND vacation_id = ?`,
    [userId, vacationId]
  );
}
