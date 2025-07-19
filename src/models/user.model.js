import { Schema } from "mongoose";
import mongoose  from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema(
    {
        username :{
            type: String,
            required :true,
            unique:true,
            lowercase :true,
            trim:true,
            index :true, // easy for search or searchable in DB

        },
         emial :{
            type:String,
            required :true,
            unique:true,
            lowercase :true,
            trim:true,
        },
        fullname :{
            type : String,
            required:true,
          trim :true,
          index : true,

        },
        avatar:{
            type: String ,// cloudinary url 
            required : true,

        },
        coverImage:{
            type:String, // cloudinary url

        },
        watchHistory :[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true , 'Passwoed is required ']
        },
        refeshToken:{
            type:string
        }

},
{
    timestamps:true
}
)
// hook  of mongoose - pre
// arrow fn cant be use in pre
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()
    this.password=bcrypt.hash(this.password,10)
    next()
    // har bar password encypt nhi karna jab bola ho tbhi karna
})

userSchema.mehtods.isPasswordCorrect = async function(password){
 return await  bcrypt.compare(password , this.password)
}
userSchema.methods.generateAccessToken = function(){
return    jwt.sign(
        {
        // payload kya kya info muje chaiyeh
        _id :this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname

    },
    process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return    jwt.sign(
        {
        // payload kya kya info muje chaiyeh
        _id :this._id,
        // email:this.email,
        // username:this.username,
        // fullname:this.fullname

    },
    process.env.REFRESH_SECRET_TOKEN
,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

export const User = mongoose.model("User",userSchema)