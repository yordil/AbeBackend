import Express from 'express';
import serviceController from '../controllers/service.controller.js';


const router = Express.Router();  

router.get("/api/service", serviceController.getAllService);
router.get("/api/service/:id", serviceController.getServiceById);
router.post("/api/service", serviceController.addService);
router.put("/api/service", serviceController.updateService);

export default router;