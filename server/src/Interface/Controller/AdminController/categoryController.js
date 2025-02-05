import categoryUseCase from "../../../Application/Usecase/categoryUsecase.js";
import logger from "../../../Framework/Utilis/logger.js";

const categoryController = {
    postAddCategory: async (req, res) => {
        try {
            const { formData } = req.body;
            const result = await categoryUseCase.addCategory(formData);
            
            if (result.message) {
                logger.warn(`Failed to add category: ${result.message}`);
                return res.status(409).json({ success: false, message: result.message });
            }
            logger.info("Category added successfully");
            return res.status(200).json({ success: true, message: "Category added successfully" });
        } catch (error) {
            logger.error(`Error in category addition: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    getAllCategories:async(req,res)=>{
        try {
            const page=parseInt(req.query.page) || 1
            const limit=parseInt(req.query.limit) || 10
            const categories=await categoryUseCase.getAllCategories(page,limit)
            logger.info(`Categories retrieved successfully - Total: ${categories.total}, Page: ${categories.page}, Limit: ${categories.limit}`);
            return res.status(200).json({success:true,categories:categories.categories,total:categories.total,page:categories.page,limit:categories.limit})
        } catch (error) {
            logger.error(`Error in fetching categories: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    getCategory:async(req,res)=>{
        try {
            const {id}=req.params
            const category=await categoryUseCase.getCategory(id)
            if(category.message){
                logger.warn(`Category not found - ID: ${id}`);
                return res.status(404).json({ success: false, message:category.message});
            }
            logger.info(`Category retrieved successfully - ID: ${id}`);
            return res.status(200).json({success:true,category})
        } catch (error) {
            logger.error(`Error in fetching category, Error: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    editCategory:async(req,res)=>{
        try {
            const {id}=req.params
            const {formData}=req.body
            const editCategory=await categoryUseCase.editCategory(id,formData)
            if(editCategory.message){
                logger.warn(`Failed to update category: ${editCategory.message}`);
                return res.status(409).json({ success: false, message:editCategory.message });
            }
            logger.info(`Category updated successfully: ${JSON.stringify(editCategory)}`);
            return res.status(200).json({ success: true, message: "Category updated successfully" });
        } catch (error) {
            logger.error(`Error in updating category: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

export default categoryController;
