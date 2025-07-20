import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app =express()

app.use(cors({
    origin: process.env.CORS_ORIGIN, 
    credentials:true
}))
// these are express configuration
//SETTING  Json format or different 
app.use(express.json({limit:"16kb"}))
// url se data accept url encodign _ -> %20
app.use(express.urlencoded({extended:true , limit:'16kb'}))

app.use(express.static("public"))
// to acces cookie in user browser and to set cookies i.e crud operation 
app.use(cookieParser())

// routes import 
import userRouter from "./routes/user.routes.js"

// routes declarstion
app.use("/api/v1/user",userRouter)// prefix

// url -> http://localhost:8000/api/v1/user/register

export {app}