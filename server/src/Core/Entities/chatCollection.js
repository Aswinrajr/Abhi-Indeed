import mongoose from 'mongoose'

const ChatSchema=new mongoose.Schema({
    members: {
        type:Array
    },
    jobId:{
        type:String
    }
},{
    timestamps:true
})
export const Chat=mongoose.model('Chat',ChatSchema)