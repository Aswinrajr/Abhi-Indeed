import logger from "../../Framework/Utilis/logger.js";
import planRepository from "../../Framework/Repositories/planRepository.js";


const planUseCase={

    addPlans:async(data)=>{
        try {
            const {planName,planDescription,planPrice,planType,planDuration} = data
            const existingPlans=await planRepository.existingPlan(planName)
            if(existingPlans){
                logger.warn(`Failed to add plan: Plan with name "${planName}" already exists.`);
                return { message: "Plan with this name already exists."};
            }

            let expirationDate = null;
            if (planType === 'duration' && planDuration) {
                const now = new Date();
                expirationDate = new Date(now.setMonth(now.getMonth() + planDuration));
            }
            const result=await planRepository.addPlans({
                planName:planName,
                amount:planPrice,
                description:planDescription,
                planType:planType,
                planDuration:planDuration,
                expirationDate
            })
            if(!result){
                logger.warn("Plan was not added successfully.");
                return {message:"Plans didn't add successfully"}
            }
            logger.info(`Plan added successfully: ${JSON.stringify(result)}`);
            return result
        } catch (error) {
            logger.error(`Failed to add plan. Error: ${error.message}`, { error });
        }
    },
    getPlans:async(page,limit,search)=>{
        try {
          const {plans,total} = await planRepository.getPlans(page,limit,search)
          if(!plans){
            logger.warn("No plans found");
            return { message: "No plans found" };
          }
          logger.info(`Fetched ${plans.length} plans. Page: ${page}, Limit: ${limit}`);
          return { plans, total };
        } catch (error) {
            logger.error(`Failed to fetch plans. Error: ${error.message}`, { error, page, limit });
        }
    },
    getPlansForEdit:async(id)=>{
        try {
            const result=await planRepository.getPlanDetails(id)
            if (!result){
                logger.warn(`No plan found with ID: ${id}`);
                return {message:"No plans found"}
            }
            return result
        } catch (error) {
            logger.error(`Failed to fetch plan details. Error: ${error.message}`, { error, id });
            return { message: "Failed to fetch plan details" };
        }
    },
    updatePlan:async(id,formData)=>{
        try {
            const {planName,planDescription,planPrice,planType,planDuration}=formData
            const existingPlan=await planRepository.existingPlan(planName)
            if(existingPlan){
                logger.warn(`Failed to edit plan: Plan with name "${planName}" already exists.`);
                return { message: "Plan with this name already exists."};
            }
            const data={
                planName:planName,
                amount:planPrice,
                description:planDescription,
                planType:planType,
                planDuration:planDuration
            }
            const result=await planRepository.editPlanDetails(id,data)
            if (!result) {
                logger.warn(`Failed to update plan with ID: ${id}`);
                return { message: "Plan update failed." };
            }

            logger.info(`Plan updated successfully: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`Failed to update plan. Error: ${error.message}`, { error, id });
            return { message: "An error occurred while updating the plan." };
        }
    },
    deletePlan:async(id)=>{
        try {
            const plan=await planRepository.deletePlans(id)
            if (!plan) {
                logger.warn(`No plan found to delete with ID: ${id}`);
                return { message: "Plan not found." };
            }
            logger.info(`Plan deleted successfully with ID: ${id}`);
            return plan;
        } catch (error) {
            logger.error(`Failed to delete plan. Error: ${error.message}`, { error, id });
        }

    },
    getPlansForRecruiter:async()=>{
        try {
            const plans=await planRepository.getPlansForRecruiter()
            if(!plans){
                logger.warn("No plans found");
                return { message: "No plans found" };
            }
            logger.info(`Fetched ${plans.length} plans.`);
             return plans
        } catch (error) {
            logger.error(`Failed to fetch plans. Error: ${error.message}`);
    }
}
}
export default planUseCase