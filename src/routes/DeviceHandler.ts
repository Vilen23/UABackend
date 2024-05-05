import express from "express"
import { checkDevice, getDevices, removeDevice } from "../controllers/Devices";
const router = express.Router();

router.get("/getDevices",getDevices);
router.post("/removeDevice",removeDevice);
router.get("/checkDevice",checkDevice);

export default router;