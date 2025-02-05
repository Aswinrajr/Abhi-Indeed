import mongoose from "mongoose";

const OrderSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Recruiter'
    },
    planId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Plans'
    },
    amount:{
        type:Number
    },
    orderDate:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
})

export const Orders=mongoose.model('Orders',OrderSchema)