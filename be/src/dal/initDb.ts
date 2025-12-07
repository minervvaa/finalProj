// src/initDb.ts
import { Database as DB } from "better-sqlite3";
import { openDb, runQuery } from "./dal";

export async function initDbSchema(): Promise<void> {
  const db: DB = await openDb();

  const ddl = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user','admin'))
);

CREATE TABLE IF NOT EXISTS vacations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  price REAL NOT NULL CHECK (price >= 0 AND price <= 10000),
  image_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS followers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  vacation_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (vacation_id) REFERENCES vacations(id) ON DELETE CASCADE,
  UNIQUE (user_id, vacation_id)
);
`;

  db.exec("BEGIN");
  try {
    db.exec(ddl);
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  } finally {
    db.close();
  }
}

 async function generateSampleData(){

  // admin user (password: 2134)
  await runQuery(`INSERT OR IGNORE INTO users (id, first_name, last_name, email, password, role)
     VALUES (1, 'Admin', 'User', 'admin@site.com', '2134', 'admin')`
  );

  // clear vacations first
  await runQuery(`DELETE FROM vacations`);

  await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
    VALUES ('Paris, France', 'Romantic city tour with museums and food.', '2025-02-10', '2025-02-20', 2500, 'paris.jpg')`);

  await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
    VALUES ('Tokyo, Japan', 'Tech, temples and cherry blossoms.', '2025-03-05', '2025-03-15', 3100, 'tokyo.jpg')`);

  await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
    VALUES ('New York, USA', 'City that never sleeps.', '2025-04-01', '2025-04-10', 2700, 'ny.jpg')`);

  await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
    VALUES ('Rome, Italy', 'Ancient monuments and pasta.', '2025-05-12', '2025-05-20', 1800, 'rome.jpg')`);

  await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
    VALUES ('Dubai, UAE', 'Skyscrapers and desert safari.', '2025-06-08', '2025-06-15', 2200, 'dubai.jpg')`);

  await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
    VALUES ('Bangkok, Thailand', 'Markets and beaches.', '2025-07-02', '2025-07-12', 1500, 'bangkok.jpg')`);

  await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
    VALUES ('Barcelona, Spain', 'Gaudi architecture.', '2025-08-03', '2025-08-11', 2100, 'barcelona.jpg')`);

  await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
    VALUES ('Santorini, Greece', 'Sunsets and relaxation.', '2025-09-01', '2025-09-08', 2600, 'santorini.jpg')`);

  await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
    VALUES ('Seoul, South Korea', 'K-culture and food.', '2025-09-20', '2025-09-29', 2300, 'seoul.jpg')`);

  await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
    VALUES ('London, UK', 'Museums and royal sites.', '2025-10-05', '2025-10-13', 2400, 'london.jpg')`);

  await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
    VALUES ('Maldives', 'Luxury villas.', '2025-11-02', '2025-11-09', 4000, 'maldives.jpg')`);

  await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
    VALUES ('Berlin, Germany', 'Modern city and art.', '2025-12-01', '2025-12-10', 2000, 'berlin.jpg')`);
}

// 3) Script entry: run both in order when you execute this file
async function initDb() {
  console.log("Starting init DB");
  await initDbSchema();
  await generateSampleData();
  console.log("Done init DB");
}

initDb().catch((err) => {
  console.error("Init DB failed:", err);
});
