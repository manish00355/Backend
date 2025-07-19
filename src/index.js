// require('dotenv').config({path: './env'})
import dotenv from "dotenv"

import connectDB from "./db/index.js"

dotenv.config({
    path:'./env'
})

connectDB()
// sucessful in .then
//listen to start the server
.then(()=>{
    app.listen(process.env.Port || 8000,()=>{
        console.log(`sever is runnig at port : ${process.env.Port}`);
    })
})
// error int .catch
.catch((err)=>{
    console.log("MongoDB connection Failed !!!", err);
})