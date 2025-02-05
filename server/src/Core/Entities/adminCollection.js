import mongoose from "mongoose";
const AdminSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    role:{
        type:String,
        default:'admin'
    },
},
{
    timestamps:true
})
export const Admin =mongoose.model('Admin',AdminSchema)