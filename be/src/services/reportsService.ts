import { runQuery } from "../dal/dal";
import { buildCsv } from "../utils/csvUtils";

export interface FollowersReportRow {
  destination: string;
  followers: number;
}

export async function getFollowersReport(): Promise <FollowersReportRow[]> {

  // running a db q to get followers count per vacation

  // now in the select -> destination (as v) + count of followers it has (as followers)
  // then select data from the vacations table 
  // and uesd "left join" to include vacations even if they have no followers 
  // last grouping by "vacation id" so cuont works per vacation and ordering the results alphabetically by destination
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
    // storing the raw rows returned from the db
    // using `any[]` to tell ts the db result is an array of rows without strict typing ( no ts error if using any)
  )) as any[];

   // mapping the raw db rows into (FollowersReportRow) objects
  return rows.map((r) => ({

   // setting the destination name for each report row
    destination: r.destination,

   // turning followers count to a number (default to 0 if null)
    followers: Number(r.followers) || 0,
  }));
}

export async function getFollowersCsv(): Promise <string> {

  // calling (getFollowersReport) to get the followers data per vacation
  const rows = await getFollowersReport();

  const csvRows = rows.map((r) => ({
    destination: r.destination,
    followers: r.followers,
    // mapping the report rows into a simple object format suitable for CSV
// each object represents one row in the CSV file

  }));
  return buildCsv(["destination", "followers"], csvRows);
  // building and returning the CSV string using column headers and the mapped rows

}
