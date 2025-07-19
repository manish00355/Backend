//two types try catch , promises

// promise wala
const asyncHandler=(requestHandler)=>{
    (req,res,resolve)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}
export {asyncHandler}



/// try catch wala

// const asyncHandler = ( )=>{}
// const asyncHandler = (fun )=>()=>{}
// const asyncHandler = (fun )=> async()=>{}
// const asyncHandler =(fn)=> async(req,res,next)=>{
//     try{
//      await fn(req,res,next)

//     }catch(error){
//            res.status(error.code || 500).json({
//             success:false,
//             message:error.message
//            })
//     }
// }