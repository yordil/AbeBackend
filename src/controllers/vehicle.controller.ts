import { Request , Response } from "express";
import vehicleService from "../services/vehicle.service.js";





const getVehicleById = async (req: Request , res: Response) => {
    
    const vehicleID = Number(req.query.id);
    const customer_id = Number(req.query.customer_id);

    
    if(vehicleID){
        const result = await vehicleService.getVehicleById(Number(req.query.id));
        console.log("PROVIDED MF")
        return res.json(result);


    }
    else if(customer_id){ 
        const result = await vehicleService.getVehicleByCustomerId(Number(req.query.customer_id));
        return res.json(result);
    }
    else{
        return res.send({message: "Please provide a valid vehicle id or customer id"});
    
    }


}

const getVehicleByCustomerId = async (req: Request , res: Response) => {
    const result = await vehicleService.getVehicleByCustomerId(Number(req.params.customer_id));
    return res.json(result);
}

const addVehicle = async (req: Request , res: Response) => {
    const result = await vehicleService.addVehicle(req.body);
    return res.json(result);
}

const updateVehicle = async (req: Request , res: Response) => {
    const result = await vehicleService.updateVehicle(req.body);
    return res.json(result);
}

export default { getVehicleById , getVehicleByCustomerId , addVehicle , updateVehicle };