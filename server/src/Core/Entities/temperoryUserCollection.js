import mongoose from "mongoose";

const temperoryUserSchema=new mongoose.Schema({
    username:{
        type:String,
    },


    email:{
        type:String,
        unique:true,
    },
    
    password:{
        type:String,
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

export const TemperoryUser=mongoose.model("TemperoryUser",temperoryUserSchema)