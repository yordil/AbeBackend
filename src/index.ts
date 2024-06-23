import express, { Express, Request, response, Response } from "express";
import pool from "./dbconfig/dbconfig.js";
import cors from "cors";
const app: Express = express();
app.use(express.json());
app.use(cors());
app.get("/", (req: Request, res: Response) => {
	res.send("Hello World");
});

const addUser = async (req: Request, res: Response) => {
	const name = req.body.name;
	const fname = req.body.fname;
	const email = req.body.email;
	const password = req.body.password;

	const db = await pool.connect();

	try {
		const query = `INSERT INTO USERTABLE (name , fathername , email , password) VALUES($1 , $2 , $3 , $4) Returning id`;
		const values = [name, fname, email, password];

		const result = await db.query(query, values);

		console.log("Inserted with user Id : ", result.rows[0]);

		res.send({
			Success: true,
			InsertedID: result.rows[0],
		});
	} catch {
		console.log("Error in the oepration");
	} finally {
		db.release();
	}
};

const login = async (req: Request, res: Response) => {
	const db = await pool.connect();

	try {
		const query = "SELECT PASSWORD FROM USERTABLE WHERE EMAIL = $1";
		const email = req.body.email;
		const password = req.body.password;

		const result = await db.query(query, [email]);

		if (result.rows.length > 0) {
			if (password == result.rows[0].password) {
				const response = {
					isLoggedin: "Sucessful",
				};

				res.status(200).json(response);
			} else {
				const response = {
					isLoggedin: "Invalid email or password",
				};

				res.status(400).json(response);
			}
		} else {
			res.send({
				Fail: "The Email Does NOT EXIST",
			});
		}
	} catch {
		console.log("there is an error in log in");
	}
};

app.post("/users/add", addUser);

app.post("/login", login);

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
