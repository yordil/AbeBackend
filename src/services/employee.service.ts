// Import required modules and types
import pool from "../dbconfig/db.config.js";
import bcrypt from "bcrypt";

// Define types for employee object and other related types as needed
interface Employee {
	employee_email: string;
	employee_password?: string;
	active_employee: boolean | 1;
	employee_first_name: string;
	employee_last_name: string;
	employee_phone: string;
	company_role_id: number;
	added_date?: Date;
}

interface employeeService {
	checkIfEmployeeExists: (email: string) => Promise<boolean>;
	createEmployee: (
		employee: Employee
	) => Promise<{ employee_id: number } | false>;
	getEmployeeByEmail: (email: string) => Promise<any>;
	getEmployee: () => Promise<any>;
	getEmployeeById: (id: number) => Promise<any>;
	updateEmployee: (data: any) => Promise<any>;
	DeleteEmployee: (id: number) => Promise<any>;
}

//  interface for getEmployeeByEmail

// find employee by email
const getEmployeeByEmail = async (email: string): Promise<any> => {
	const query =
		"SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id WHERE employee.employee_email = $1";
	const { rows } = await pool.query(query, [email]);
	console.log("THIS IS ROWS", rows);
	return rows;
};

// Function to check if an employee exists in the database
async function checkIfEmployeeExists(email: string): Promise<boolean> {
	const query = "SELECT * FROM employee WHERE employee_email = $1";
	const { rows } = await pool.query(query, [email]);
	console.log(rows);
	return rows.length > 0;
}

// Function to create a new employee
async function createEmployee(
	employee: Employee
): Promise<{ employee_id: number } | false> {
	let createdEmployee: { employee_id: number } | false = false;
	try {
		// Generate a salt and hash the password
		const salt = await bcrypt.genSalt(10);
		// Hash the password
		const hashedPassword = await bcrypt.hash(
			employee.employee_password || "",
			salt
		);

		// Insert the email into the employee table
		const query =
			"INSERT INTO employee (employee_email, active_employee) VALUES ($1, $2) RETURNING employee_id";
		const { rows } = await pool.query(query, [
			employee.employee_email,
			employee.active_employee,
		]);
		console.log(rows);
		if (rows.length !== 1) {
			return false;
		}
		// Get the employee id from the insert
		const employee_id = rows[0].employee_id;

		// Insert remaining data into the employee_info, employee_pass, and employee_role tables
		const query2 =
			"INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES ($1, $2, $3, $4)";
		await pool.query(query2, [
			employee_id,
			employee.employee_first_name,
			employee.employee_last_name,
			employee.employee_phone,
		]);

		const query3 =
			"INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES ($1, $2)";
		await pool.query(query3, [employee_id, hashedPassword]);

		const query4 =
			"INSERT INTO employee_role (employee_id, company_role_id) VALUES ($1, $2)";
		await pool.query(query4, [employee_id, employee.company_role_id]);

		// Construct the employee object to return
		createdEmployee = { employee_id };
	} catch (err) {
		console.error(err);
	}

	return createdEmployee;
}

const getEmployee = async (): Promise<any> => {
	// selecting all employee from the table by joinning as above
	// select everything to render
	const query = `
SELECT 
    employee.employee_id,
    employee.employee_email,
    employee.active_employee,
    employee.added_date,
    employee_info.employee_first_name,
    employee_info.employee_last_name,
    employee_info.employee_phone,
    employee_role.company_role_id
FROM 
    employee 
INNER JOIN 
    employee_info ON employee.employee_id = employee_info.employee_id 
INNER JOIN 
    employee_pass ON employee.employee_id = employee_pass.employee_id 
INNER JOIN 
    employee_role ON employee.employee_id = employee_role.employee_id
`;

	try {
		const { rows } = await pool.query(query);

		return rows;
	} catch (err) {
		console.error(err, "error in getEmployee");
		return { message: "Something went wrong", status: 500 };
	}
};

const getEmployeeById = async (id: number): Promise<any> => {
	const query = `	
	SELECT 
		employee.employee_id,
		employee.employee_email,
		employee.active_employee,
		employee.added_date,
		employee_info.employee_first_name,
		employee_info.employee_last_name,
		employee_info.employee_phone,
		employee_role.company_role_id,
		employee_role.company_role_id
	FROM 
    employee 
INNER JOIN 
    employee_info ON employee.employee_id = employee_info.employee_id 
INNER JOIN 
    employee_pass ON employee.employee_id = employee_pass.employee_id 
INNER JOIN 
    employee_role ON employee.employee_id = employee_role.employee_id

	WHERE employee.employee_id = $1`;

	try {
		const { rows } = await pool.query(query, [id]);
		return rows;
	} catch (err) {
		console.error(err, "error in getEmployee");
		return { message: "Something went wrong", status: 500 };
	}
};

const updateEmployee = async (data: any): Promise<any> => {
	const updateEmployeeInfo = `
    UPDATE employee_info
    SET 
        employee_first_name = $1,
        employee_last_name = $2,
        employee_phone = $3
    WHERE
        employee_id = $4;
  `;

	const updateActive = `
    UPDATE employee
    SET 
        active_employee = $1
    WHERE
        employee_id = $2;
  `;

	const updateEmployeeRole = `
    UPDATE employee_role
    SET 
        company_role_id = $1
    WHERE
        employee_id = $2;
  `;

	console.log(data);
	const dataArr = [
		data.employee_id, // 0
		data.employee_first_name, // 1
		data.employee_last_name, // 2
		data.employee_phone, // 3
		data.active_employee, // 4
		data.company_role_id, // 5
	];

	const UpdateEm = [dataArr[1], dataArr[2], dataArr[3], dataArr[0]]; // [firstName, lastName, phone, employeeId]
	const updateAc = [dataArr[4], dataArr[0]]; // [activeEmployee, employeeId]
	const updateRole = [dataArr[5], dataArr[0]]; // [companyRoleId, employeeId]

	console.log(dataArr, "*********");

	try {
		await pool.query("BEGIN");

		const { rows: rows1 } = await pool.query(updateEmployeeInfo, UpdateEm);
		const { rows: rows2 } = await pool.query(updateEmployeeRole, updateRole);
		const { rows: rows3 } = await pool.query(updateActive, updateAc);

		await pool.query("COMMIT");

		return {
			message: "Employee updated successfully",
			status: 200,
		};
	} catch (err) {
		console.error(err, "error in updateEmployee");
		return { message: "Something went wrong", status: 500 };
	}
};

const DeleteEmployee = async (id: number): Promise<any> => {
	const deleteEmployeeQuery = `
      DELETE FROM employee
      WHERE employee_id = $1;
    `;
	const result = await pool.query(deleteEmployeeQuery, [id]);
	if (result.rowCount != null) {
		return {
			sucess: true,
			message: "deleted Successfully",
		};
	} else {
		return {
			sucess: false,
			message: "Error in deleting",
		};
	}
};

const employeeService: employeeService = {
	checkIfEmployeeExists,
	createEmployee,
	getEmployeeByEmail,
	getEmployee,
	getEmployeeById,
	updateEmployee,
	DeleteEmployee,
};

// Export the functions for use in the controller
export default employeeService;
