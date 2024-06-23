import express, { Express, Request, Response } from "express";
import pool from "./dbconfig/dbconfig.js";
import cors from "cors";

const app: Express = express();
app.use(express.json());
app.use(
	cors({
		origin: "*",
	})
);

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World");
});

const addUser = async (req: Request, res: Response) => {
	const { name, fname, email, password } = req.body;

	const client = await pool.connect();
	try {
		const query = `
      INSERT INTO USERTABLE (name, fname, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
		const values = [name, fname, email, password];

		const result = await client.query(query, values);
		console.log("Inserted with user Id:", result.rows[0]);

		res.json({
			Success: true,
			InsertedID: result.rows[0].id,
		});
	} catch (err) {
		console.error("Error inserting user:", err);
		res.status(500).json({ error: "Error inserting user" });
	} finally {
		client.release();
	}
};

const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	const client = await pool.connect();
	try {
		const query = "SELECT password FROM USERTABLE WHERE email = $1";
		const result = await client.query(query, [email]);

		if (result.rows.length > 0) {
			if (password === result.rows[0].password) {
				res.json({ isLoggedin: "Successful" });
			} else {
				res.status(400).json({ error: "Invalid email or password" });
			}
		} else {
			res.status(400).json({ error: "Email does not exist" });
		}
	} catch (err) {
		console.error("Error logging in:", err);
		res.status(500).json({ error: "Error logging in" });
	} finally {
		client.release();
	}
};

app.post("/users/add", addUser);
app.post("/login", login);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
