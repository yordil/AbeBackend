import Express from 'express';
import install from './install.routes.js';
import login from './login.routes.js';
import employee from './employee.routes.js';
import service from './service.routes.js';
import customer from './customer.routes.js';
import vehicle from './vehicle.routes.js';
import order from './order.routes.js';  
const router = Express.Router();

router.use(install);
router.use(login);
router.use(employee);
router.use(service)
router.use(customer)
router.use(vehicle)
router.use(order)

export default router;
