import { Category } from "../../Core/Entities/categoryCollection.js";
import logger from "../Utilis/logger.js";


const categoryRepository={

    findExistingCategory:async(categoryName)=>{
        try {
            const existingCategory=await Category.findOne({categoryName:new RegExp(`^${categoryName}$`, 'i')})
            logger.info(`Category found: ${categoryName}`);
            return existingCategory
        } catch (error) {
            logger.error(`Error finding category: ${error.message}`);
        }
    },
    addNewCategory:async(categoryData)=>{
        try {
            const newCategory=new Category(categoryData)
            await newCategory.save()
            logger.info(`Category added successfully: ${JSON.stringify(newCategory)}`);
            return newCategory
        } catch (error) {
            logger.error(`Error adding new category: ${error.message}`);
        }
    },
    getCategories:async(page,limit)=>{
        try {
            const skip=(page-1)*limit
            const categories=await Category.find().skip(skip).limit(limit)
            const total=await Category.countDocuments()
            logger.info(`Retrieved ${categories.length} categories, Total categories: ${total}`);
            return {categories,total}
        } catch (error) {
            logger.error(`Error retrieving categories: ${error.message}`);
        }
    },
    getAllCategories:async()=>{
        try {
            const categories=await Category.find()
            logger.info(`Retrieved ${categories.length} categories`);
            return categories
        } catch (error) {
            logger.error(`Error retrieving categories: ${error.message}`);
        }
    },
    getIndividualCategory:async(id)=>{
        try {
            const category = await Category.findById(id);
            if (category) {
                logger.info(`Category retrieved successfully: ${JSON.stringify(category)}`);
            } else {
                logger.warn(`Category not found with ID: ${id}`);
            }
            return category
        } catch (error) {
            logger.error(`Error retrieving category with ID ${id}: ${error.message}`);
        }
    },
    editCategory:async(id,newDetails)=>{
        try {
            const updatedCategory=await Category.findByIdAndUpdate({_id:id},newDetails,{new:true})
            if(updatedCategory){
                logger.info(`Category updated successfully: ${JSON.stringify(updatedCategory)}`);
            }else{
                logger.warn(`Category not found with ID: ${id}`);
            }
            return updatedCategory
        } catch (error) {
            logger.error(`Error updating category with ID ${id}: ${error.message}`);
        }
    }


}
export default categoryRepository