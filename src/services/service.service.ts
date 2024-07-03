import pool from "../dbconfig/db.config.js";

interface Service {
	service_id?: number;
	service_name: string;
	service_description: string;
}

interface errorOrSuccess {
	message: string;
	status: number;
}

interface ServiceService {
	getAllService: () => Promise<Promise<Service>[] | errorOrSuccess>;
	getServiceById: (id: number) => Promise<Service | errorOrSuccess>;
	addService: (data: Service) => Promise<errorOrSuccess>;
    updateService: (data: Service) => Promise<errorOrSuccess>  
}

const getAllService = async (): Promise<
	Promise<Service>[] | errorOrSuccess
> => {
	try {
		const query = "SELECT * FROM common_services";
		const result = await pool.query(query);
		return result.rows;
	} catch (err) {
		console.error(err, "error in getAllService");
		return { message: "Something went wrong", status: 500 };
	}
};

const getServiceById = async (
	id: number
): Promise<Service | errorOrSuccess> => {
	const query = `SELECT * FROM common_services WHERE service_id = $1`;
	try {
		const result = await pool.query(query, [id]);
		return result.rows[0];
	} catch (err) {
		console.error(err, "error in getServiceById");
		return { message: "Something went wrong", status: 500 };
	}
};

const addService = async (data: Service): Promise<errorOrSuccess> => {
	const query = `INSERT INTO common_services (service_name, service_description) VALUES ($1, $2) RETURNING *`;
	const values = [data.service_name, data.service_description];
	try {
		const result = await pool.query(query, values);
		return {
			message: "Service added successfully",
			status: 200,
		};
	} catch (err) {
		console.error(err, "error in addService");
		return { message: "Something went wrong on Adding Service", status: 500 };
	}
};

const updateService = async (data: Service): Promise<errorOrSuccess> => { 
    const query = `UPDATE common_services SET service_name = $1 , service_description = $2 WHERE service_id
    = $3 RETURNING *`;
    const values = [data.service_name , data.service_description , data.service_id]
    try{
        const result = await pool.query(query , values)
        return { message: "Service updated successfully" , status: 200}
    }
    catch(err){
        console.error(err, "error in updateService");
        return { message: "Something went wrong on Updating Service", status: 500 };
    }
}

const serviceService: ServiceService = {
	getAllService,
	getServiceById,
	addService,
    updateService
};

export default serviceService;
