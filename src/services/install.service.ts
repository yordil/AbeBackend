import db from "../dbconfig/db.config.js";
import fs from "fs";
import path from "path";

interface finalMessage {
	message?: string;
	status?: number;
}

const install = async () => {
	const queries: string[] = [];
	let currentline: string = "";
	let finalMessage: finalMessage = {};

	try {
		// Get the directory path of the current module
		const __dirname = path.dirname(new URL(import.meta.url).pathname);
		let filePath: string = path.join(
			__dirname,
			"../services/sql/initial-queries.sql"
		);
		filePath =
			"C:\\Users\\hp\\Desktop\\AP and others\\tsxProject\\AbeGarage\\AbeBackend\\src\\services\\sql\\initial-queries.sql";
		// Check if the SQL file exists
		if (fs.existsSync(filePath)) {
			// Read the SQL file
			const file = fs.readFileSync(filePath, "utf8");
			const lines = file.split("\n");

			await new Promise<void>((resolve, reject) => {
				try {
					lines.forEach((line) => {
						if (line.trim().startsWith("--") || line.trim() === "") {
							// Skip if it's a comment or empty line
							return;
						}
						currentline += line;
						if (line.trim().endsWith(";")) {
							const sqlQuery = currentline.trim();
							queries.push(sqlQuery);
							currentline = "";
						}
					});
					resolve();
				} catch (error) {
					reject(error);
				}
			});

			// Connect to the database pool

			// Execute each query
			for (let i = 0; i < queries.length; i++) {
				const query = queries[i];
				try {
					const res = await db.query(query); 
					
					console.log("Query executed successfully:", query);
				} catch (err) {
					console.error("Error in executing query:", err);
					finalMessage.message = "Error in executing queries";
					finalMessage.status = 500;
					break; 
				}
			}

			db.release(); // Release the database connection

			// Set final message on success
			if (!finalMessage.message) {
				finalMessage.message = "Tables Created Successfully";
				finalMessage.status = 200;
			}
		} else {
			console.error("SQL file not found:", filePath);
			finalMessage.message = "SQL file not found";
			finalMessage.status = 500;
		}
	} catch (error) {
		console.error("Error during installation", error);
		finalMessage.message = "Error during installation";
		finalMessage.status = 500;
	}

	return finalMessage;
};

export default {
	install,
};
