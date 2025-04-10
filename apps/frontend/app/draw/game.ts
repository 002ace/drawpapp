
type Shape= {
    type:"rect",
    x:number,
    y:number,
    width:number,
    height:number
} | {

    type:"circel",
    centerX:number,
    centerY:number,
    radius:number

}


export const   game = (canvas:HTMLCanvasElement)=>
{  
    
             const ctx  =  canvas.getContext("2d");
             let existingShape:Shape[] = []

             if(!ctx) return

             // ctx.fillRect(25,25,100,100)
             // ctx.strokeRect(25,25,100,100)
             ctx.fillStyle =  "rgba(0,0,0)";
             ctx.fillRect(0,0,canvas.width, canvas.height)
             let el  = false;
             let startX = 0 ;
             let startY = 0 ;
             canvas.addEventListener("mousedown" , (e)=>{
                 console.log("mouse down event")
                 el=true;
                 startX =  e.clientX
                 startY = e.clientY ;
             })

             canvas.addEventListener("mouseup" ,(e)=>{
                 el=false;
                 console.log("mouse up event")
                 console.log(e.clientX ,"mouse  up");
                 console.log(e.clientY , "mouse up");
                 let width = e.clientX - startX;
                 let height = e.clientY - startY;

                 existingShape.push({
                       type:"rect",
                       x:startX,
                       y:startY,
                       width:width,
                       height:height
                 })
             })

             canvas.addEventListener("mousemove" , (e)=>{
                   if(el)
                   {
                       let width = e.clientX - startX;
                        let height = e.clientY - startY;

                        clearCanvas(existingShape , canvas ,ctx);
                        ctx.strokeStyle = "rgba(255,255,255)";
                        ctx.strokeRect(startX, startY, width, height);

                        // ctx.clearRect(0, 0, canvas.width, canvas.height);
                        // ctx.fillStyle =  "rgba(0,0,0)";
                        // ctx.fillRect(0,0,canvas.width, canvas.height)
                        // ctx.strokeStyle = "rgba(255,255,255)"
                        // ctx.strokeRect(startX, startY, width, height);

                   }

             })

        

}

const   clearCanvas  = (existingShape:Shape[] , canvas :HTMLCanvasElement , ctx:CanvasRenderingContext2D)=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle =  "rgba(0,0,0)";
    ctx.fillRect(0,0,canvas.width, canvas.height)
    existingShape.map((shape)=>{
        if(shape.type =="rect"){
         ctx.strokeStyle = "rgba(255,255,255)"
         ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    })
}