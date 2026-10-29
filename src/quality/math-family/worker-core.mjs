export function handle(calculate){self.onmessage=({data:{id,state}})=>{try{self.postMessage({id,result:calculate(state)});}catch(e){self.postMessage({id,error:e.message,field:e.field});}};}
