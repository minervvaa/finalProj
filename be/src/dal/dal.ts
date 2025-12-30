// the same code you ues in class (copy and paste it )

import fs from "fs";
import Database, { Database as DB, RunResult } from "better-sqlite3";

export async function openDb(dbFile: string = "db.db"): Promise<DB> {

    if (!fs.existsSync(dbFile)) {
        fs.writeFileSync(dbFile, "");
    }

    const db = new Database(dbFile,
        {
            fileMustExist: false,
            verbose: undefined   
        });

    return db;
}

export async function runQuery(
    sql: string,
    params: Record<string, unknown> | unknown[] = []
): Promise<unknown[] | { changes: number; lastInsertRowid: number | bigint }> {


    const db = await openDb();
    const stmt = db.prepare(sql);  
    if ((stmt as any).reader === true) {
        // SELECT

        return Array.isArray(params) ? stmt.all(...params) : stmt.all(params);
    } else {
        // INSERT/UPDATE/DELETE
        const res: RunResult = Array.isArray(params)
            ? stmt.run(...params)
            : stmt.run(params);
        // const res: RunResult = stmt.run();
        return { changes: res.changes, lastInsertRowid: res.lastInsertRowid };
    }

    // TODO: db.close()
}