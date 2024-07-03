import { Request, Response } from "express";
import loginService from "../services/login.service.js";
import jwt from "jsonwebtoken";
const secret : string = process.env.JWT_SECRET || "";


interface Login {
	login: (req: Request, res: Response) => void;
}
interface emailAndPassword {
	employee_email: string;
	employee_password: string;
}

const login = async (req: Request, res: Response) => {
	const emailAndPassword: emailAndPassword = {
		employee_email: req.body.employee_email,
		employee_password: req.body.employee_password,
	};
	const result = await loginService.login(emailAndPassword);

	if (result.status === 200) {
		const Sendpayload = {
			employee_id: result.data.employee_id,
			employee_email: result.data.employee_email,
			employee_role: result.data.company_role_id,
			employee_first_name: result.data.employee_first_name,
		};

		const token: string = jwt.sign(Sendpayload, secret, {
			expiresIn: "24h",
		});

		res.status(200).send({
			employee_token: token,
			
		});
	} else if (result.status === 403) {
		res.status(404).send({ message: result.message });
	} else {
		res.status(500).send({ message: result.message });
	}
};

const loginController: Login = { login };

export default loginController;
