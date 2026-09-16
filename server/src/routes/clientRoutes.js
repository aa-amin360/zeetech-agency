import { Router } from "express";
import { getClients } from "../controllers/clientController.js";

const router = Router();

router.get("/", getClients);

export default router;
