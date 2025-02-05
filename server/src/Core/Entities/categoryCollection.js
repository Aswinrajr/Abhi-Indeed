import mongoose from "mongoose";

const CategorySchema=new mongoose.Schema({
    categoryName:{
        type:String
    },
    categoryDescription:{
      type:String
    }
},{
    timestamps:true
})
export const Category = mongoose.model('Category', CategorySchema);