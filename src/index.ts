import express, { Express, Request, Response } from "express";
import pool from "./dbconfig/db.config.js";
import cors from "cors";
const app: Express = express();
const Router  = express.Router();
import routes from "./routes/index.js";
import dotenv from "dotenv";

dotenv.config();

app.use(express.json());
app.use(
	cors({
		origin: "*",
	})
	);
	
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});



