import mongoose from "mongoose";
const RecruiterSchema=new mongoose.Schema({
    recruitername:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    companyName:{
        type:String
    },
    contact:{
        type:Number,
    },
    block:{
        type: Boolean,
        default:false,
    },
    otpCode: {
          type: String,
    },
    otpExpiration: {
          type: Date,
    },
    role:{
        type:String,
        default:"recruiter"
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isSubscribed:{
        type:Boolean,
        default:false
    }
      },
{
    timestamps:true
})

export const Recruiter=mongoose.model('Recruiter',RecruiterSchema)