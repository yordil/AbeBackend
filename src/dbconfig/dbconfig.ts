import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

interface DBConfig {
	DB_HOST: string;
	DB: string;
	DB_USER: string;
	DB_PASS: string;
	DB_PORT: string;
}

// Create a function to parse and validate environment variables
function getDBConfig(): DBConfig {
	const config: DBConfig = {
		DB_USER: process.env.DB_USER || "",
		DB_HOST: process.env.DB_HOST || "",
		DB: process.env.DB || "",
		DB_PASS: process.env.DB_PASS || "",
		DB_PORT: process.env.DB_PORT || "",
	};

	
	if (
		!config.DB_USER ||
		!config.DB_HOST ||
		!config.DB ||
		!config.DB_PASS ||
		!config.DB_PORT
	) {
		throw new Error("Missing required database environment variables");
	}
	return config;
}

const dbConfig = getDBConfig();

const pool = new Pool({
	user: dbConfig.DB_USER,
	host: dbConfig.DB_HOST,
	database: dbConfig.DB,
	password: dbConfig.DB_PASS,
	port: parseInt(dbConfig.DB_PORT),
});

export default pool;
