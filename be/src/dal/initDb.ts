import { Database as DB } from "better-sqlite3";
import { openDb, runQuery } from "./dal";

export async function initDbSchema(): Promise<void> {
  const db: DB = await openDb();

  // we need 3 tables : users , vacations , followers
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

  // --- admin user --- (password: 2134)
  await runQuery(`INSERT OR IGNORE INTO users (id, first_name, last_name, email, password, role)
     VALUES (1, 'Admin', 'User', 'admin@site.com', '2134', 'admin')`
  );
  await runQuery(`INSERT OR IGNORE INTO users (id, first_name, last_name, email, password, role)
     VALUES (2, 'Mado', 'User', 'mado@m.com', '1111', 'admin')`
  );


  // clear vacations first
  await runQuery(`DELETE FROM vacations`);

  // --- vacations ---

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Paris, France', 'Romantic city tour with museums and food.', '2025-02-10', '2025-02-20', 2500, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Tokyo, Japan', 'Tech, temples and cherry blossoms.', '2025-03-05', '2025-03-15', 3100, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('New York, USA', 'City that never sleeps.', '2025-04-01', '2025-04-10', 2700, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Rome, Italy', 'Ancient monuments and pasta.', '2025-05-12', '2025-05-20', 1800, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Dubai, UAE', 'Skyscrapers and desert safari.', '2025-06-08', '2025-06-15', 2200, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Bangkok, Thailand', 'Markets and beaches.', '2025-07-02', '2025-07-12', 1500, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Barcelona, Spain', 'Gaudi architecture.', '2025-08-03', '2025-08-11', 2100, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Santorini, Greece', 'Sunsets and relaxation.', '2025-09-01', '2025-09-08', 2600, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Seoul, South Korea', 'K-culture and food.', '2025-09-20', '2025-09-29', 2300, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('London, UK', 'Museums and royal sites.', '2025-10-05', '2025-10-13', 2400, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Maldives', 'Luxury villas.', '2025-11-02', '2025-11-09', 4000, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Berlin, Germany', 'Modern city and art.', '2025-12-01', '2025-12-10', 2000, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Amsterdam, Netherlands', 'Canals and cycling culture.', '2025-01-15', '2025-01-22', 2100, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Prague, Czech Republic', 'Old town charm.', '2025-02-01', '2025-02-08', 1700, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Vienna, Austria', 'Classical music and palaces.', '2025-02-18', '2025-02-25', 1900, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Lisbon, Portugal', 'Colorful streets and food.', '2025-03-01', '2025-03-09', 1600, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Milan, Italy', 'Fashion and design.', '2025-03-20', '2025-03-27', 1800, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Venice, Italy', 'Canals and romance.', '2025-04-05', '2025-04-12', 2300, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Florence, Italy', 'Art and history.', '2025-04-15', '2025-04-22', 2000, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Athens, Greece', 'Ancient ruins.', '2025-05-01', '2025-05-08', 1700, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Istanbul, Turkey', 'East meets West.', '2025-05-10', '2025-05-18', 1600, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Cairo, Egypt', 'Pyramids and history.', '2025-05-22', '2025-05-30', 1400, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Marrakech, Morocco', 'Markets and culture.', '2025-06-01', '2025-06-08', 1500, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Cape Town, South Africa', 'Nature and wine.', '2025-06-10', '2025-06-20', 2600, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Nairobi, Kenya', 'Safari adventure.', '2025-06-25', '2025-07-03', 2800, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Bali, Indonesia', 'Beaches and temples.', '2025-07-05', '2025-07-15', 2400, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Singapore', 'Modern city-state.', '2025-07-18', '2025-07-25', 2900, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Sydney, Australia', 'Harbor and beaches.', '2025-08-01', '2025-08-12', 3500, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Melbourne, Australia', 'Arts and coffee.', '2025-08-15', '2025-08-24', 3300, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Auckland, New Zealand', 'Nature and city life.', '2025-09-01', '2025-09-10', 3600, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Los Angeles, USA', 'Hollywood and beaches.', '2025-09-12', '2025-09-20', 2800, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('San Francisco, USA', 'Golden Gate and tech.', '2025-09-22', '2025-09-30', 2900, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Las Vegas, USA', 'Entertainment capital.', '2025-10-01', '2025-10-06', 2000, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Toronto, Canada', 'Multicultural city.', '2025-10-08', '2025-10-15', 2300, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Vancouver, Canada', 'Nature and city.', '2025-10-18', '2025-10-26', 2500, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Rio de Janeiro, Brazil', 'Beaches and carnival.', '2025-11-01', '2025-11-10', 2700, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Buenos Aires, Argentina', 'Culture and tango.', '2025-11-12', '2025-11-20', 2600, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Santiago, Chile', 'Mountains and city.', '2025-11-22', '2025-11-30', 2500, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Lima, Peru', 'Food and history.', '2025-12-01', '2025-12-09', 2400, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Cusco, Peru', 'Gateway to Machu Picchu.', '2025-12-10', '2025-12-18', 2600, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Reykjavik, Iceland', 'Northern lights.', '2026-01-05', '2026-01-12', 3200, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Oslo, Norway', 'Fjords and culture.', '2026-01-15', '2026-01-22', 3000, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Stockholm, Sweden', 'Scandinavian design.', '2026-01-25', '2026-02-01', 2900, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Helsinki, Finland', 'Nordic lifestyle.', '2026-02-03', '2026-02-10', 2800, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Warsaw, Poland', 'History and resilience.', '2026-02-12', '2026-02-19', 1800, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Budapest, Hungary', 'Thermal baths.', '2026-02-20', '2026-02-27', 1700, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Zagreb, Croatia', 'Charming old town.', '2026-03-01', '2026-03-08', 1600, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Split, Croatia', 'Adriatic coast.', '2026-03-10', '2026-03-17', 1900, '')`);

await runQuery(`INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
VALUES ('Dubrovnik, Croatia', 'Medieval walls.', '2026-03-20', '2026-03-27', 2100, '')`);


}

async function initDb() {
  console.log("Starting init DB");
  await initDbSchema();
  await generateSampleData();
  console.log("Done init DB");
}

initDb().catch((err) => {
  console.error("Init DB failed:", err);
});
