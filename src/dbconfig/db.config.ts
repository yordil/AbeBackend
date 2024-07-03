import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB,
	password: process.env.DB_PASS,
	port: 5432,
	// ssl: {
	// 	rejectUnauthorized: true,
	// },
	max: 10,
});

pool.on("error", (err, client) => {
	console.error("Error on connecting the db check dbconfig", err);
});

const db = await pool.connect();



export default db;
