// Create PostgreSQL Connection Pool here !
import * as pg from "pg";

const { Pool } = pg.default;

const connectionPool = new Pool({
  // ตรงนี้ต้องเปลี่ยน connectionString เป็นของตัวเองด้วยนะ
  connectionString: process.env.CONNECTION_STRING,
});

export default connectionPool;

