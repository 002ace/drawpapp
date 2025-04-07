import  express, { Router }  from "express";


const router:Router =  express.Router();

import {signup , login} from "../controller/user"

//@ts-ignore
router.post("/signup" , signup);
//@ts-ignore
router.post("/login" , login);


export default router;

