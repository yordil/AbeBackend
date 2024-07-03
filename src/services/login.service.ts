import db from "../dbconfig/db.config.js";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import employeeService from "./employee.service.js";

interface emailAndPassword {
	employee_email: string;
	employee_password: string;
   
}

interface loginService {
	login: (data: emailAndPassword) => Promise<returnData>;
}

interface returnData {
	message: string;
	status: number;
    data?: any
}

const login = async (data: emailAndPassword): Promise<returnData> => {
	const result = await employeeService.getEmployeeByEmail(data.employee_email);
	console.log(result, "*********");
	if (result.length === 0) {
		return { message: "User does not exist", status: 404 };
	} else {
		try {
            
        
			const match = await bcrypt.compare(
				data.employee_password,
				result[0].employee_password_hashed
			);

			if (match) {
               
				return { message: "Login Successful", status: 200, data: result[0] };
			} else {
				return { message: "Incorrect Password", status: 403 };
			}
		} catch (error) {
            console.log(error);
			return { message: "Something went wrong", status: 500 };
		}
	}
};

const loginService: loginService = { login };

export default loginService;
