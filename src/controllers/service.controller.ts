import Express, { Request, Response } from "express";
import ServiceService from "../services/service.service.js";
import exp from "constants";

const getAllService = async (req: Request, res: Response) => {
	const result = await ServiceService.getAllService();
	return res.json(result);
};

const getServiceById = async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const result = await ServiceService.getServiceById(id);
	return res.json(result);
};

const addService = async (req: Request, res: Response) => { 
    const result = await ServiceService.addService(req.body);
    return res.json(result);
}

const updateService = async (req :Request  , res : Response) => {
    const result  = await ServiceService.updateService(req.body)
    return res.json(result)
}

export default { getAllService, getServiceById  , addService , updateService };
