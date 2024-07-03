import { Request , Response } from "express";
import customerService from "../services/customer.service.js";


const getAllCustomers  = async (req: Request , res: Response) => {
    const result  = await customerService.getAllCustomers();
    return res.json(result);
}

const getCustomerById = async (req: Request , res: Response) => {
    const result = await customerService.getCustomerById(Number(req.params.id));
    return res.json(result);
}

const addCustomer = async (req: Request , res: Response) => {
    const result = await customerService.addCustomer(req.body);
    return res.json(result);

}

const updateCustomer = async (req: Request , res: Response) => {
    const result = await customerService.updateCustomer(req.body);
    return res.json(result);
}

export default { getAllCustomers , getCustomerById , addCustomer , updateCustomer};   
