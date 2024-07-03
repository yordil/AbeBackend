import { randomBytes } from "crypto";
import pool from "../dbconfig/db.config.js";

// Define types for employee object and other related types as needed

interface customer {
	customer_id?: number;
	customer_email: string;
	customer_phone_number: string;
	customer_first_name: string;
	customer_last_name: string;
	active_customer_status: boolean | 1;
	customer_hash?: string;
	customer_added_date?: Date;
	statuss: 200;
}

interface errorOrSuccess {
	message: string;
	status: number;
}

interface customerService {
	addCustomer: (customer: customer) => Promise<errorOrSuccess>;
	updateCustomer: (customer: customer) => Promise<errorOrSuccess>;
	getCustomerById: (id: number) => Promise<customer | errorOrSuccess>;
	getAllCustomers: () => Promise<customer[] | errorOrSuccess>;
}

const addCustomer = async (customer: customer): Promise<errorOrSuccess> => {
	const query1 = `INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash) 
                    VALUES ($1, $2, $3) RETURNING customer_id`;
	
	const hashedvalue = randomBytes(16).toString("hex");
	const data1 = [
		customer.customer_email,
		customer.customer_phone_number,
		hashedvalue,
	];

	try {
		const result1 = await pool.query(query1, data1);
        
		const query2 = `INSERT INTO customer_info (customer_id , customer_first_name , customer_last_name , active_customer_status ) VALUES ($1, $2 , $3 , $4)`;
		const data2 = [
			result1.rows[0].customer_id,
			customer.customer_first_name,
			customer.customer_last_name,
			customer.active_customer_status,
		];
		const result2 = await pool.query(query2, data2);

		return { message: "Customer added successfully", status: 200 };
	} catch (error) {
		console.log(error);
		return { message: "Something went wrong", status: 500 };
	}
};

const updateCustomer = async (customer: customer): Promise<errorOrSuccess> => {
	const query1 =
		"UPDATE customer_info SET  customer_first_name = $1, customer_last_name = $2, active_customer_status = $3 WHERE customer_id = $4";
	const data1 = [
		customer.customer_first_name,
		customer.customer_last_name,
		customer.active_customer_status,
		customer.customer_id,
	];
	const query2 =
		"UPDATE customer_identifier SET customer_phone_number = $1 WHERE customer_id = $2";
	const data2 = [customer.customer_phone_number, customer.customer_id];
	try {
		const result1 = await pool.query(query1, data1);
		const result2 = await pool.query(query2, data2);

		return { message: "Customer updated successfully", status: 200 };
	} catch (error) {
		console.log(error);
		return { message: "Something went wrong", status: 500 };
	}
};

const getCustomerById = async (
	id: number
): Promise<customer | errorOrSuccess> => {
	
	const query = `SELECT * 
                    FROM customer_info ci JOIN customer_identifier cd 
                    ON ci.customer_id = cd.customer_id WHERE ci.customer_id = $1`;

	const data = [id];
	try {
		const result = await pool.query(query, data);
       
      
		return result.rows[0];

	} catch (error) {
		console.log(error);
		return { message: "Something went wrong", status: 500 };
	}
};

const getAllCustomers = async (): Promise<customer[] | errorOrSuccess> => {
	const query =
		"SELECT * FROM customer_info ci JOIN customer_identifier cd ON ci.customer_id = cd.customer_id";
	try {
		const result = await pool.query(query);
		return result.rows;
	} catch (err) {
		console.log(err);
		return {
			message: "Something went wrong on getting All customer service",
			status: 500,
		};
	}
};

const customerService: customerService = {
	addCustomer,
	updateCustomer,
	getCustomerById,
	getAllCustomers,
};

export default customerService;
