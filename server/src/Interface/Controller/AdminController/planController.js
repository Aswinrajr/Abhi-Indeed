import logger from "../../../Framework/Utilis/logger.js";
import planUseCase from "../../../Application/Usecase/planUsecase.js";


const planController={

    addPlans:async(req,res)=>{
        try {
            const {planName, planDescription, planPrice, planType, planDuration} = req.body
            const formData={planName, planDescription, planPrice, planType, planDuration}
            const result =await planUseCase.addPlans(formData)
            if(result.message){
                logger.warn(`Failed to add plan: ${result.message}`);
                return res.status(400).json({success:false,message:result.message})
            }
            logger.info("Plan added successfully.");
            return res.status(201).json({success:true,message:"Plans added successfully"})
        } catch (error) {
            logger.error(`Error adding plan: ${error.message}`, { error });
            return res.status(500).json({ success: false, message: "An error occurred while adding the plan" });
        }
    },
    getPlans:async(req,res)=>{
        try {
            const page=parseInt(req.query.page) || 1
            const limit=parseInt(req.query.limit) || 5
            const search = req.query.search || '';            
            const planData=await planUseCase.getPlans(page,limit,search)
            if(planData.message){
                logger.warn(`Failed to retrieve plans: ${planData.message}`);
                return res.status(404).json({ success: false, message: planData.message });
            }

            logger.info(`Plans retrieved successfully. Page: ${page}, Limit: ${limit}`);
            return res.status(200).json({ success: true, plans: planData.plans, total: planData.total });
        } catch (error) {
            logger.error(`Error fetching plans: ${error.message}`, { error });
            return res.status(500).json({ success: false, message: "An error occurred while fetching plans" });
        }
    },
    getPlansForEdit:async(req,res)=>{
        try {
            const {id}=req.params
            const plan=await planUseCase.getPlansForEdit(id)
            if (!plan) {
                logger.warn(`No plan found with ID: ${id}`);
                return res.status(404).json({ success: false, message: "No plan found" });
            }

            logger.info(`Plan retrieved successfully. ID: ${id}`);
            return res.status(200).json({ success: true, plan });
        } catch (error) {
            logger.error(`Error fetching plan for edit: ${error.message}`, { error });
            return res.status(500).json({ success: false, message: "An error occurred while fetching the plan" });
        }
    },
    updatePlan:async(req,res)=>{
        try {
            const {id}=req.params
            const {formData}=req.body
            const result=await planUseCase.updatePlan(id,formData)
            if (result.message) {
                logger.warn(`Failed to update plan: ${result.message}`);
                return res.status(400).json({ success: false, message: result.message });
            }
            logger.info(`Plan updated successfully. ID: ${id}`);
            return res.status(200).json({ success: true, message: "Plan updated successfully", plan: result });
        } catch (error) {
            logger.error(`Error updating plan: ${error.message}`, { error });
            return res.status(500).json({ success: false, message: "An error occurred while updating the plan" });
        }
    },
    deletePlan:async(req,res)=>{
        try {
            const {id}=req.params
            const result=await planUseCase.deletePlan(id)
            if(result.message){
                logger.warn(`Failed to delete plan: ${result.message}`);
                return res.status(400).json({success:false,message:result.message})
            }
            logger.info(`Plan deleted successfully. ID: ${id}`);
            return res.status(200).json({ success: true, message: "Plan deleted successfully" });
        } catch (error) {
            logger.error(`Error deleting plan: ${error.message}`, { error });
            return res.status(500).json({ success: false, message: "An error occurred while deleting the plan" });
        }
    }
}
export default planController