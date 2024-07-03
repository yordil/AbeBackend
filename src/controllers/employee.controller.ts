import exp from "constants";
import employeeService from "../services/employee.service.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const adduser = async (req: Request, res: Response) => {
	const result = await employeeService.checkIfEmployeeExists(
		req.body.employee_email
	);

	if (result) {
		res.status(404).send({ message: "Email already exists" });
	} else {
		const result = await employeeService.createEmployee(req.body);
		res.status(200).send({ message: "Employee added successfully" });
	}
};

const getUser = async (req: Request, res: Response) => {
	const result = await employeeService.getEmployee();

	return res.json(result);
};

const getEmployeeById = async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const result = await employeeService.getEmployeeById(id);

	return res.json(result);
};

const updateEmployee = async (req: Request, res: Response) => {
	const result = await employeeService.updateEmployee(req.body);
    console.log(result)
    if (result.status == 200){

        return res.send({ message: "Employee updated successfully" });
    }
    else {
        return res.send({ message: "Something went wrong" });
    }
};

const DeleteEmployee = async (req : Request , res : Response) => {
    const id = Number(req.params.id)
    const result = await employeeService.DeleteEmployee(id)
	return res.json(result);
}

export default { adduser, getUser, getEmployeeById, updateEmployee , DeleteEmployee };
