import Express from "express";
import e, { Request, Response } from "express";
import employee from "../controllers/employee.controller.js";
const router = Express.Router();

router.post("/api/employee", employee.adduser);
router.get("/api/employee", employee.getUser);
router.get("/api/employee/:id", employee.getEmployeeById);
router.put("/api/employee", employee.updateEmployee);
router.delete("/api/employee/:id" , employee.DeleteEmployee)


export default router;
