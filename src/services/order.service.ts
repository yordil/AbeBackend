import { randomBytes } from "crypto";
import pool from "../dbconfig/db.config.js";

interface orderService {
	getAllOrders: () => Promise<Promise<Order>[] | errorOrSuccess>;
	getOrderById: (id: number) => Promise<Order | errorOrSuccess>;
	addOrder: (order: Order) => Promise<errorOrSuccess>;
	// updateOrder: (order: Order) => Promise<errorOrSuccess>;
}
const orderQuery = `SELECT 
                    o.order_id,
                    o.employee_id,
                    o.customer_id,
                    o.vehicle_id,
                    o.order_date,
                    oi.estimated_completion_date,
                    oi.completion_date,
                    os.order_status,
                    json_agg(json_build_object('service_id', osvc.service_id)) AS order_services
                FROM 
                    orders o
                JOIN 
                    order_info oi ON o.order_id = oi.order_id
                JOIN 
                    order_status os ON o.order_id = os.order_id
                LEFT JOIN 
                    order_services osvc ON o.order_id = osvc.order_id
                GROUP BY 
                    o.order_id, oi.estimated_completion_date, oi.completion_date, os.order_status
                ORDER BY 
                    o.order_id;`;
interface ServiciesForOrder {
	service_id: number;
}

interface errorOrSuccess {
	message: string;
	status: number;
}

interface Order {
	order_id?: number;
	employee_id: number;
	customer_id: number;
	vehicle_id: number;
	order_description: string;
	estimated_completion_date: string; // or Date if you plan to parse this string to a Date object
	completion_date: string | null; // or Date | null
	order_completed: number;
	order_services: ServiciesForOrder[];
}

const addOrder = async (order: Order): Promise<errorOrSuccess> => {
	const query = `INSERT INTO orders(employee_id, customer_id, vehicle_id , active_order , order_hash) VALUES ($1, $2, $3 , $4 , $5) RETURNING order_id`;
	const hashedvalue = randomBytes(16).toString("hex");
	const value1 = [
		order.employee_id,
		order.customer_id,
		order.vehicle_id,
		1,
		hashedvalue,
	];

	try {
		const orderResult = await pool.query(query, value1);
		console.log("first mf ");

		const query2 = `INSERT INTO order_info(order_id , estimated_completion_date, completion_date , order_total_price, additional_requests_completed) VALUES ($1, $2, $3 , $4 , $5) RETURNING order_id`;
		const query3 = `INSERT INTO order_status(order_id, order_status) VALUES ($1, $2) RETURNING order_id`;
		const orderId = orderResult.rows[0].order_id;
		const value2 = [
			orderId,
			order.estimated_completion_date,
			order.completion_date,
			1000,
			0,
		];
		const value3 = [orderId, order.order_completed];
		const orderInfo = await pool.query(query2, value2);
		console.log("himf");
		const orderStatus = await pool.query(query3, value3);
		const orderServices = order.order_services.map((service) => {
			return `(${orderId}, ${service.service_id} , 0)`;
		});
		console.log(orderServices);

		const queryForService = `INSERT INTO order_services(order_id, service_id , service_completed) VALUES ${orderServices.join(
			", "
		)}`;

		await pool.query(queryForService);

		return {
			message: "Order added successfully",
			status: 200,
		};
	} catch (error) {
		console.log(error);
		return {
			message: "An error occurred while adding order",
			status: 500,
		};
	}
};

// const updateOrder = async (order: Order): Promise<errorOrSuccess> => {
// 	try {
// 		const updateOrderQuery = `
//       UPDATE orders
//       SET order_status= $1
//       WHERE order_id = $2;
//     `;
// 		await pool.query(updateOrderQuery, [
// 			order.order_description,
// 			order.order_id,
// 		]);

// 		const updateOrderInfoQuery = `
//       UPDATE order_info
//       SET estimated_completion_date = $1, completion_date = $2
//       WHERE order_id = $3;
//     `;
// 		await pool.query(updateOrderInfoQuery, [
// 			order.estimated_completion_date,
// 			order.completion_date,
// 			order.order_id,
// 		]);

// 		return {
// 			message: "Order updated successfully",
// 			status: 200,
// 		};
// 	} catch (error) {
// 		console.log(error);
// 		return {
// 			message: "An error occurred while updating order",
// 			status: 500,
// 		};
// 	}
// };

const getAllOrders = async (): Promise<Promise<Order>[] | errorOrSuccess> => {
	const query = `SELECT 
                    o.order_id,
                    o.employee_id,
                    o.customer_id,
                    o.vehicle_id,
                    o.order_date,
                    oi.estimated_completion_date,
                    oi.completion_date,
                    os.order_status,
                    json_agg(json_build_object('service_id', osvc.service_id)) AS order_services
                FROM 
                    orders o
                JOIN 
                    order_info oi ON o.order_id = oi.order_id
                JOIN 
                    order_status os ON o.order_id = os.order_id
                LEFT JOIN 
                    order_services osvc ON o.order_id = osvc.order_id
                GROUP BY 
                    o.order_id, oi.estimated_completion_date, oi.completion_date, os.order_status
                ORDER BY 
                    o.order_id;`;

	try {
		const orders = await pool.query(query);
		return orders.rows;
	} catch (error) {
		console.log(error);
		return {
			message: "An error occurred while fetching orders",
			status: 500,
		};
	}
};

const getOrderById = async (id: number): Promise<Order | errorOrSuccess> => {
	const query = `SELECT 
                    o.order_id,
                    o.employee_id,
                    o.customer_id,
                    o.vehicle_id,
                    o.order_date,
                    oi.estimated_completion_date,
                    oi.completion_date,
                    os.order_status,
                    json_agg(json_build_object('service_id', osvc.service_id)) AS order_services
                FROM 
                    orders o
                JOIN 
                    order_info oi ON o.order_id = oi.order_id
                JOIN 
                    order_status os ON o.order_id = os.order_id
                LEFT JOIN 
                    order_services osvc ON o.order_id = osvc.order_id
                WHERE 
                    o.order_id = $1
                GROUP BY 
                    o.order_id, oi.estimated_completion_date, oi.completion_date, os.order_status
                ORDER BY 
                    o.order_id;`;

	try {
		const order = await pool.query(query, [id]);
		return order.rows[0];
	} catch (error) {
		console.log(error);
		return {
			message: "An error occurred while fetching order",
			status: 500,
		};
	}
};

const orderService: orderService = {
	getAllOrders,
	getOrderById,
	addOrder,
	// updateOrder,
};

export default orderService;
