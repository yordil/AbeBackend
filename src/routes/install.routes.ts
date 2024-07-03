import express from "express";
import installController  from "../controllers/install.controller.js";

const router = express.Router();

router.post("/install", installController.install);

export default router;
