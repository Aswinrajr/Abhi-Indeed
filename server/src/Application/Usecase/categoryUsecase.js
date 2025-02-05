import categoryRepository from "../../Framework/Repositories/categoryRepository.js";
import logger from "../../Framework/Utilis/logger.js";

const categoryUseCase = {
    addCategory: async (formData) => {
        try {
            const { categoryName, description } = formData;
            const existingCategory = await categoryRepository.findExistingCategory(categoryName);
            
            if (existingCategory) {
                logger.warn(`Category already exists: ${categoryName}`);
                return { message: "Category already exists" };
            }
            
            const newCategory = await categoryRepository.addNewCategory({
                categoryName: categoryName,
                categoryDescription: description
            });
            
            logger.info("Category added successfully");
            return newCategory;
        } catch (error) {
            logger.error(`Error in adding category: ${error.message}`);
        }
    },
    getAllCategories:async(page,limit)=>{
        try {
            const {categories,total}=await categoryRepository.getCategories(page,limit)
            if(!categories){
                logger.warn("No categories found");
                return { message: "Categories not found" };
            }else{
                logger.info(`Categories retrieved successfully - Total: ${total}, Page: ${page}, Limit: ${limit}`);
                return {categories,total,page,limit}
            }
        } catch (error) {
            logger.error(`Error in fetching categories: ${error.message}`);
        }
    },
    getAllCategoriesForRecruiter:async()=>{
        try {
            const categories=await categoryRepository.getAllCategories()
            if(!categories){
                logger.warn("No categories found");
                return { message: "Categories not found" };
            }else{
                logger.info('Categories retrieved successfully');
                return categories
            }
        } catch (error) {
            logger.error(`Error in fetching categories: ${error.message}`);
        }

    },
    getCategory:async(id)=>{
        try {
            const category=await categoryRepository.getIndividualCategory(id)
            if(!category){
                logger.warn(`Category not found - ID: ${id}`);
                return ({message:"Category not found"})
            }else{
                logger.info(`Category retrieved successfully - ID: ${id}`);
                return category
            }
        } catch (error) {
            logger.error(`Error in fetching category - ID: ${id}, Error: ${error.message}`);
        }
    },
    editCategory:async(id,formData)=>{
        try {
            const {categoryName,description}=formData
            const existingCategory=await categoryRepository.findExistingCategory(categoryName)
            if (existingCategory && existingCategory._id.toString() !== id) {
                logger.warn(`Category name conflict: ${categoryName}`);
                return { message: "Category name already exists" };
            }
            const updatedCategory=await categoryRepository.editCategory(id,{categoryName,categoryDescription:description})
            if(!updatedCategory){
                logger.warn(`Failed to update category with ID: ${id}`);
                return { message: "Failed to update category" };
            }
            logger.info(`Category updated successfully with ID: ${id}`);
            return updatedCategory;
        } catch (error) {
            logger.error(`Error in updating category: ${error.message}`);
        }
    }
};

export default categoryUseCase;
