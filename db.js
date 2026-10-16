// db.js

import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export const db = {
  async getManuals() {
    const result = await pool.query(
      "SELECT * FROM manuals"
    );

    return result.rows;
  }
};
