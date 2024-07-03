import Expres from 'express';
const router = Expres.Router(); 

import vehicleController from '../controllers/vehicle.controller.js';

router.get('/api/vehicles', vehicleController.getVehicleById);
router.post('/api/vehicles', vehicleController.addVehicle);
router.put('/api/vehicles', vehicleController.updateVehicle);

export default router;
