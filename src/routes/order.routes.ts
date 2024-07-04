import Express from 'express';
const router  = Express.Router()    

import orderController from "../controllers/order.controller.js";

router.get("/api/orders" , orderController.getAllOrders);
router.get("/api/orders/:id" , orderController.getOrderById);
router.post("/api/orders" , orderController.addOrder);
router.put("/api/orders" , orderController.updateOrder);

export default router;  