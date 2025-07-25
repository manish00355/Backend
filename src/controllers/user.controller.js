import { asyncHandler } from "../utils/asynchHandler.js";
import { ApiError } from "../utils/ApiError.js";

import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAcessAndRefreshTokens = async(userId)=>
    {
    try{
       const user = await User.findById(userId)

   const accessToken =     user.generateAccessToken()
const refreshToken =   user.generateRefreshToken()

user.refreshToken = refreshToken
await user.save({ValidateBeforeSave : false})
 return {accessToken,refreshToken}

    }
    catch(error){
        throw new ApiError(500,"someting went Wrong while generating refresh and acess token")
    }
}


const registerUser = asyncHandler(async (req,res)=>{
   

    /// get user details from frontend
    // validation  - not empty
    //check  if user exist usernmae , email
    // check for images , avator
    // uplaod them to cloudinary ,avatar
    // create user object - create entry in db
    // remove password and refresh token filed from response 
    // check for user creation
    // return res


    const {fullname , email,username,password} =req.body
    console.log("email: ",email);


    // if(fullname === ""){
    //     throw new ApiError(400, "fullname is required")
    // }

    if(
        [fullname , email ,username,password].some((field)=>
            field?.trim()===""
        )
    ){
throw  new ApiError (400, "all fileds are required")
    }
 const existedUser =  await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
       throw new ApiError(409 , "user with emial or username exists")
    }
   const  avatarLocalPath =  req.files?.avatar[0]?.path;

  const coverImageLocalPath =  req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400 , "Avatar file is required")
  }
  // upload on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath)

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if (!avatar) {
    throw new ApiError(400 , "Avatar file is required")
  }
 // entry in database 
 //create a object
 const user = await  User.create({
    fullname,
    avatar : avatar.url,
    coverImage: coverImage?.url || "",
    username : username.toLowerCase(),
    email,
    password,

   })
   // check user i created or not
 const  createdUser = await User.findById(user._id).select(
    "-password -refreshToken"

    
 )
 if (!createdUser){
  throw new ApiError(500,"Something went wrong while registering the user")
    }
    // returing response 
    return res.status(201).json(
        new ApiResponse(200 , createdUser, "user created sucessfully")
    )

})
// user login
const loginUser =asyncHandler(async (req,res)=>{

    // req body -> data 
    // username or email 
    // find the user
    // password check 
    // send cookie

    const {email , username , password} = req.body

    if(!username || !email){
        throw new ApiError(400 , "username or password is required")
    }
    // when only one filed 
    //User.findOne({email})
    // when multiple filed

 const user =  await User.findOne({
        $or:[{username},{email}]
    })
    // when there is no user
if(!user){
        throw new ApiError(404 ,"User doesnot exist")
}
 const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"wrong Password")
}

 const {acessToken , refreshToken} = await generateAcessAndRefreshTokens(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
 // sending cookies 
      
 const options ={
    httpOnly:true,
    secure:true, // only modify by server

 }
 return res
 .status(200)
 .cookie("accessToken", acessToken,options)
 .cookie("refreshToken",refreshToken,options)
 .json(
    new ApiResponse(
        200,
        {
            user:loggedInUser ,acessToken ,refreshToken
        }, "user loggedIn successfully"
    )
 )



})
// log out 

const logoutUser = asyncHandler(async(req ,res)=>{
   await User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{
            refreshToken:undefined
        }
    },{
        new : true
    }
  )
   const options ={
    httpOnly:true,
    secure:true, // only modify by server

  
     
 }
 return res
 .status(200)
 .clearCookie('accessToken',options)
 .clearCookie('refreshToken',options)
 .json(new ApiResponse(200 , {}, "user logged out sucessfully"))
})

const refreshAcessToken = asyncHandler(async(req,res)=>{
  const incomingRefreshToken =   req.cookies.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken){
    throw new ApiError(401,"unauthorized request")
  }
 const decodedToken=  jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET

  )
 const user = await User.findById(decodedToken?._id)
 if(!user){
    throw new ApiError(401,"invalid refresh token")
}
if(incomingRefreshToken !== user?.refreshToken) {
     throw new ApiError(401,"invalid refresh token")
}
 const options ={
    httpOnly :true,
    secure : true
 }
  const {accessToken , newRefreshToken} = await generateAcessAndRefreshTokens(user._id)

  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",newRefreshToken,options)
  .json(
    new ApiError(
        200,
        {
    accessToken , refreshToken:newRefreshToken
        },
        "Acess token refreshed"
    )
  )
})


export {registerUser,
        loginUser,
        logoutUser,
        refreshAcessToken
}