import express, { Request, Response } from 'express';
import { Twofactorhandler, check2Fa, getToken } from '../controllers/Twofactorhandler';
import { Signin } from '../controllers/Signin';
import { verifyToken } from '../controllers/verify';

const router = express.Router();

router.post('/2fa', Twofactorhandler);
router.post('/signin',Signin);
router.get("/check2fa",check2Fa);
router.get("/getToken",getToken);
router.get("/verifyToken",verifyToken)

export default router;