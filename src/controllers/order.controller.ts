import {Request , Response}from 'express';

import orderService from '../services/order.service.js';

const getAllOrders = async (req: Request , res: Response) => {
    const result = await orderService.getAllOrders();
    return res.json(result);
}

const getOrderById = async (req: Request , res: Response) => {
    const result = await orderService.getOrderById(Number(req.params.id));
    return res.json(result);
}

const addOrder = async (req: Request , res: Response) => {

    const result = await orderService.addOrder(req.body);
    return res.json(result);
}

const updateOrder = async (req: Request , res: Response) => {
    const result = await orderService.updateOrder(req.body);
    return res.json(result);
}

export default { getAllOrders , getOrderById , addOrder  , updateOrder}