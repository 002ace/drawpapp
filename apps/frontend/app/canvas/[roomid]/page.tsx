"use client"

import { useEffect, useRef } from "react"
import {game} from "@/app/draw/game"


export default  function Canvas (){
    
    const canvasRef  =  useRef<HTMLCanvasElement>(null)

    useEffect(()=>{

        //    if(canvasRef.current)
        //    {    
        //         const canvas  =  canvasRef.current;
        //         const ctx  =  canvas.getContext("2d");

        //         if(!ctx) return

        //         // ctx.fillRect(25,25,100,100)
        //         // ctx.strokeRect(25,25,100,100)
        //         ctx.fillStyle =  "rgba(0,0,0)";
        //         ctx.fillRect(0,0,canvas.width, canvas.height)
        //         let el  = false;
        //         let startX = 0 ;
        //         let startY = 0 ;
        //         canvas.addEventListener("mousedown" , (e)=>{
        //             console.log("mouse down event")
        //             el=true;
        //             startX =  e.clientX
        //             startY = e.clientY ;
        //         })

        //         canvas.addEventListener("mouseup" ,(e)=>{
        //             el=false;
        //             console.log("mouse up event")
        //             console.log(e.clientX ,"mouse  up");
        //             console.log(e.clientY , "mouse up");
        //         })

        //         canvas.addEventListener("mousemove" , (e)=>{
        //               if(el)
        //               {
        //                   let width = e.clientX - startX;
        //                    let height = e.clientY - startY;

        //                    ctx.clearRect(0, 0, canvas.width, canvas.height);
        //                    ctx.fillStyle =  "rgba(0,0,0)";
        //                    ctx.fillRect(0,0,canvas.width, canvas.height)
        //                    ctx.strokeStyle = "rgba(255,255,255)"
        //                    ctx.strokeRect(startX, startY, width, height);

        //               }

        //         })

        //    }
        if(canvasRef.current){
        game(canvasRef.current);
        }

    },[])

    return <div>
          <canvas height={1000} width={2000} ref={canvasRef}></canvas>

    </div>
}