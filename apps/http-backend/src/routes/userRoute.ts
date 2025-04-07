import  express, { Router }  from "express";


const router:Router =  express.Router();

import {signup , login ,createRoom ,getRoomDetails,getChatDetails} from "../controller/user"
import{middleware} from "../controller/middleware"

//@ts-ignore
router.post("/signup" , signup);
//@ts-ignore
router.post("/login" , login);
//@ts-ignore
router.post("/room" , middleware , createRoom)
//@ts-ignore
router.get("/details",getRoomDetails)
//@ts-ignore
router.get("/chat/:roomId",getChatDetails)


export default router;

