import categoryUseCase from "../../../Application/Usecase/categoryUsecase.js";
import logger from "../../../Framework/Utilis/logger.js";

const categoryController={
    getAllCategories:async(req,res)=>{
        try {
            const categories=await categoryUseCase.getAllCategoriesForRecruiter()
            logger.info('Categories retrieved successfully')
            return res.status(200).json({success:true,categories})
        } catch (error) {
            logger.error(`Error in fetching categories: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

}
export default categoryController