import pool from "../dbconfig/db.config.js";

interface errorOrSuccess {
	message: string;
	status: number;
}

interface vehicleService {
	addVehicle: (vehicle: vehicle) => Promise<errorOrSuccess>;
    getVehicleById: (id: number) => Promise<vehicle | errorOrSuccess>;
    getVehicleByCustomerId: (id: number) => Promise<vehicle | errorOrSuccess>;
    updateVehicle: (vehicle: vehicle) => Promise<errorOrSuccess>;

}

interface vehicle {
    vehicle_id?: number;
	customer_id?: number;
	vehicle_year: number;
	vehicle_make: string;
	vehicle_model: string;
	vehicle_type: string;
	vehicle_mileage: string;
	vehicle_tag: string;
	vehicle_serial: string;
	vehicle_color: string;
    statuss: 200;   
}
//  Add  A VEHCILE
const addVehicle = async (vehicle: vehicle): Promise<errorOrSuccess> => {
	const query = `INSERT INTO customer_vehicle_info 
    (customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
	const data = [
		vehicle.customer_id,
		vehicle.vehicle_year,
		vehicle.vehicle_make,
		vehicle.vehicle_model,
		vehicle.vehicle_type,
		vehicle.vehicle_mileage,
		vehicle.vehicle_tag,
		vehicle.vehicle_serial,
		vehicle.vehicle_color,
	];
	try {
		const result = await pool.query(query, data);
		return { message: "Vehicle added successfully", status: 200 };
	} catch (error) {
		console.log(error);
		return { message: "Something went wrong", status: 500 };
	}
};

//  get vehicle by id 

const getVehicleById = async (id: number): Promise<vehicle | errorOrSuccess> => { 

    const query  = `SELECT * FROM customer_vehicle_info WHERE vehicle_id = $1`;
    try{
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }catch(err){ 
        console.error(err, "error in getVehicleById");
        return { message: "Something went wrong", status: 500 };
    
    }
}

//  getting by customer ID 

const getVehicleByCustomerId = async (id: number): Promise<vehicle | errorOrSuccess> => { 

    const query  = `SELECT * FROM customer_vehicle_info WHERE customer_id = $1`;
    try{
        const result = await pool.query(query, [id]);
        return result.rows[0]; 
    }catch(err){ 
        console.error(err, "error in getVehicleById");
        return { message: "Something went wrong", status: 500 };
    }
}


// updating a vehicle info 

const updateVehicle = async (vehicle: vehicle): Promise<errorOrSuccess> => { 
    const query = `UPDATE customer_vehicle_info SET vehicle_year = $1 , vehicle_make = $2 , vehicle_model = $3 , vehicle_type = $4 , vehicle_mileage = $5 , vehicle_tag = $6 , vehicle_serial = $7 , vehicle_color = $8 WHERE vehicle_id = $9 RETURNING *`;
    const values = [vehicle.vehicle_year , vehicle.vehicle_make , vehicle.vehicle_model , vehicle.vehicle_type , vehicle.vehicle_mileage , vehicle.vehicle_tag , vehicle.vehicle_serial , vehicle.vehicle_color , vehicle.vehicle_id]
    try{
        const result = await pool.query(query , values)
        return { message: "Vehicle updated successfully" , status: 200}
    }catch(err){ 
        console.error(err, "error in updateVehicle");
        return { message: "Something went wrong on Updating Vehicle", status: 500 };
    }

}




const vehicleService: vehicleService = { addVehicle  , getVehicleById , getVehicleByCustomerId , updateVehicle};

export default vehicleService;
