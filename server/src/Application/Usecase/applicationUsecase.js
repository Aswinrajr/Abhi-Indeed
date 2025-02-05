import logger from "../../Framework/Utilis/logger.js";
import applicationRepository from "../../Framework/Repositories/applicationRepository.js";
import jobRepository from "../../Framework/Repositories/jobRepository.js";

const applicationUseCase={
    getApplicationByRecruiter:async(id)=>{
        try {
            const application=await applicationRepository.getApplicationByRecruiter(id)
            if(!application){
                logger.warn(`Recruiter ID: ${id}`);
                return {message:"Application not found"}
            }else{
                logger.info(`Applications fetched successfully for recruiter ID: ${id}`);
                return application;
            }
        } catch (error) {
            logger.error(`Error fetching applications for recruiter ID: ${id} - ${error.message}`);
        }
    },
    getApplicationDetails:async(id)=>{
        try {
            const application=await applicationRepository.getApplicationDetails(id)
            if(!application){
                logger.warn(`Application ID: ${id}`);
                return {message:"Application not found"}
            }else{
                logger.info(`Application details fetched successfully for application ID: ${id}`);
                return application;
            }
        } catch (error) {
            logger.error(`Error fetching application details for application ID: ${id} - ${error.message}`);
        }
    },
    updateStatus:async(id,status)=>{
        try {
            const result=await applicationRepository.updateApplicationStatus(id,status)
            if (!result) {
                logger.warn(`Failed to update status for application ID: ${id}`);
                return { message: "Failed to update status" };
            } else {
                logger.info(`Status updated successfully for application ID: ${id}`);
                return result;
            }
        } catch (error) {
            logger.error("Error on update status")
        }
    },
    checkAlreadyApplied:async(jobId,userId)=>{
        try {
            const existingApplication=await applicationRepository.findAlreadyApply(jobId,userId)
            if(existingApplication){
                logger.info(`User ${userId} has already applied for job with ID: ${jobId}`);
                return {hasApplied:true, message: "You have already applied for this job" };
            }
            logger.info(`User ${userId} has not applied for job with ID: ${jobId}`);
            return { hasApplied: false };
        } catch (error) {
            logger.error(`Error checking if user ${userId} applied for job ${jobId}: ${error.message}`);
            return { error: "Failed to check job application status" };
        }
    },
    getUnappliedJobs:async(userId)=>{
        try {
            const unappliedJobs=await applicationRepository.getUnappliedJobs(userId)
            logger.info(`Fetched unapplied jobs for user ${userId}. Total unapplied jobs: ${unappliedJobs.length}`);
            return unappliedJobs
        } catch (error) {
            logger.error(`Error fetching unapplied jobs for user ${userId}: ${error.message}`);
        }
    },
    getApplicationforCandidates:async(id,page,limit)=>{
        try {
            const {application,total}=await applicationRepository.getApplicationforCandidates(id,page,limit)
            if(!application || application.length===0){
                logger.warn(`No applications found for candidate ID: ${id}`);
                return { message: "Application not found" };
            }else{
                logger.info(`Successfully fetched ${application.length} applications for candidate ID: ${id}`);
                return { application, total };
            }
        } catch (error) {
            logger.error(`Error fetching applications for candidate ID: ${id} - ${error.message}`);
        }
    },
    getSearchApplication:async(userId, page, limit, searchTerm)=>{
        try {
            const {application,total}=await applicationRepository.getSearchedApplication(userId,page,limit,searchTerm)
            console.log(application,"APPLIC");
            
            if (!application || application.length === 0) {
                logger.warn(`No applications found for candidate ID: ${userId}`);
                return { message: "Application not found" };
            } else {
                logger.info(`Successfully fetched ${application.length} applications for candidate ID: ${userId}`);
                return { application, total };
            }
        } catch (error) {
            logger.error(`Error fetching applications for candidate ID: ${userId} - ${error.message}`);
        }
    }

}
export default applicationUseCase