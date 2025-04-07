import  express  from "express";
import cookieParser from "cookie-parser";
const app =  express();
 
import userRouter from "./routes/userRoute";


app.use(express.json());
app.use(cookieParser());
app.use("/api" , userRouter);
app.listen(3001, ()=>{
     console.log("servere runing successfully");
})