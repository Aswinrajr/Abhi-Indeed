import mongoose from 'mongoose'
const temperoryRecruiterSchema=new mongoose.Schema({
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

      },
{
    timestamps:true
})

export const TemperoryRecruiter=mongoose.model("TemperoryRecruiter",temperoryRecruiterSchema)