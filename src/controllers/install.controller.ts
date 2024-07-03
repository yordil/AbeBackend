import { Request, Response } from "express";
// services
import installService from "../services/install.service.js";

const install = async (req: Request, res: Response) => {
    const result  = await installService.install();
    
    return res.json(result);

};

export default {
	install,
};
