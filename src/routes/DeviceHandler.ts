import express from "express"
import { getDevices, removeDevice } from "../controllers/Devices";
const router = express.Router();

router.get("/getDevices",getDevices);
router.post("/removeDevice",removeDevice)

export default router;