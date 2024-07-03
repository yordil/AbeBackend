import Express from 'express';
const router  = Express.Router();

import loginController from "../controllers/login.controller.js";


router.post("/api/employee/login", loginController.login);

export default router;