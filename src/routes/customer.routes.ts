import Express from 'express';
const router  = Express.Router()
import customerController from "../controllers/customer.controller.js";

router.get("/api/customers" , customerController.getAllCustomers);
router.get("/api/customers/:id" , customerController.getCustomerById);
router.post("/api/customers" , customerController.addCustomer);
router.put("/api/customers" , customerController.updateCustomer);

export default router;