import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB,
	password: process.env.DB_PASS,
	port: 5432,
	ssl: {
		rejectUnauthorized: true,
		
	},
	max: 10,
});

pool.on("error", (err, client) => {
	console.error("Unexpected error on idle client", err);
	process.exit(-1); // Consider handling this more gracefully in production
});

export default pool;
