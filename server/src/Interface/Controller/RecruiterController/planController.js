import logger from "../../../Framework/Utilis/logger.js";
import planUseCase from "../../../Application/Usecase/planUsecase.js";

const planControl={
    getPlansForRecruiter:async(req,res)=>{
        try {
            const plans=await planUseCase.getPlansForRecruiter()
            if(plans.message){
                logger.warn(`Failed to retrieve plans: ${plans.message}`);
                return res.status(404).json({ success: false, message: plans.message });
            }
            logger.info(`Plans retrieved successfully.`);
            return res.status(200).json({ success: true, plans: plans});
        } catch (error) {
            logger.error(`Error fetching plans: ${error.message}`, { error });
            return res.status(500).json({ success: false, message: "An error occurred while fetching plans" });
        }
    }

}
export default planControl

