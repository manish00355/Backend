import mongoose ,{Schema}from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
        videoFiles:{
            type:String ,//cloudnary url
            required:true,

        } ,
        thumbnail :{
            type:String ,//cloudnary url
            required:true,
        },
          title :{
            type:String ,
            required:true,
        },
          description :{
            type:String ,
            required:true,
        },
        duration :{
            type:Number ,// cloudnary
            required:true,
        },
        views :{
            type:Number ,//
            defualt:0
        },
        isPublished:{
            type:Boolean,
            default:true,

        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
        
        
        
        


},
{
    timpestamps:true

}
)

videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("video",videoSchema)