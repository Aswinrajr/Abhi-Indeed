import { Plans } from "../../Core/Entities/planCollection.js";
import logger from "../Utilis/logger.js";


const planRepository={
    existingPlan:async(planName)=>{
        try {
            const existingPlan=await Plans.findOne({planName:new RegExp(`^${planName}$`, 'i')})
            if(existingPlan){
                logger.info(`Plan with the name "${planName}" already exists.`);
            }
            return existingPlan
        } catch (error) {
            logger.error(`Failed to check if plan exists. Error: ${error.message}`, { error });
        }
    },
    addPlans:async(data)=>{
        try {
            const result= new Plans(data)
            await result.save()
            logger.info(`Plan added successfully: ${JSON.stringify(data)}`)
            return result
        } catch (error) {
            logger.error(`Failed to add plan. Error: ${error.message}`, { error });
        }
    },
    getPlans:async(page,limit,search)=>{
        try {
            const skip=(page-1)*limit
            const plans=await Plans.find({planName: { $regex: search, $options: 'i'}}).skip(skip).limit(limit)
            const total=await Plans.countDocuments({planName: { $regex: search, $options: 'i'}})
            logger.info(`Fetched ${plans.length} plans. Page: ${page}, Limit: ${limit}`);
            return {plans,total}
        } catch (error) {
            logger.error(`Failed to fetch plans. Error: ${error.message}`, { error, page, limit });
        }
    },
    getPlanDetails:async(id)=>{
        try {
            const plan=await Plans.findById({_id:id})
            if (!plan) {
                logger.info(`No plan found with ID: ${id}`);
            }
            return plan
        } catch (error) {
            logger.error(`Failed to fetch plan details. Error: ${error.message}`, { error, id });
        }
    },
    editPlanDetails:async(id,data)=>{
        try {
            const updatedPlan=await Plans.findByIdAndUpdate({_id:id},data,{new:true})
            if (!updatedPlan) {
                logger.info(`No plan found to update with ID: ${id}`);
            }
            return updatedPlan
        } catch (error) {
            logger.error(`Failed to update plan details. Error: ${error.message}`, { error, id });
        }
    },
    deletePlans:async(id)=>{
        try {
            const deletePlan=await Plans.findByIdAndDelete({_id:id})
            if(deletePlan){
                logger.info(`Plan deleted successfully with ID: ${id}`);
            } else {
                logger.info(`No plan found to delete with ID: ${id}`);
            }
            return deletePlan
        } catch (error) {
            logger.error(`Failed to delete plan. Error: ${error.message}`, { error, id });
        }

    },
    getPlansForRecruiter:async()=>{
        try {
            const plans=await Plans.find({})
            logger.info(`Fetched ${plans.length} plans.`);
            return plans
        } catch (error) {
            logger.error(`Failed to fetch plans. Error: ${error.message}`);
        }
    }

}
export default planRepository