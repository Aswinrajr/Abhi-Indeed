
import jobUseCase from "../../../Application/Usecase/jobUsecase.js"
import logger from "../../../Framework/Utilis/logger.js"

const jobController={

    postJob:async(req,res)=>{
        try {
            const jobData={...req.body,jobPostedBy:req.recruiter.recruiter._id}
            const job=await jobUseCase.postJob(jobData)
            if(job.message){
                logger.warn(`Failed to post job: ${job.message}`);
                res.status(400).json({success:false,message:job.message})
            }else{
                logger.info(`Job created successfully`);
                res.status(200).json({success:true,message:"Job created successfully",job:job.newJob})
            }
        } catch (error) {
            logger.error(`Error in postJob: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })
        }
    },
    getAllJobs:async(req,res)=>{
        try {
            const page=parseInt(req.query.page) || 1
            const limit=parseInt(req.query.limit) || 10
            const jobs=await jobUseCase.getAllJobs(page,limit)
            logger.info(`Retrieved all jobs, count: ${jobs.total}`);
            res.status(200).json({success:true,jobs:jobs.activeJobs,total:jobs.total,page:jobs.page,limit:jobs.limit})
        } catch (error) {
            logger.error(`Error in getAllJobs: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })
        }
    },
    showJobs:async(req,res)=>{
        try {
            const {id}=req.params
            const { page = 1, limit = 10, searchTerm = '' } = req.query;
            const jobs=await jobUseCase.showJobs(id, { page, limit, searchTerm })
            if (!jobs.jobs.length) {
                logger.warn(`No jobs found for recruiter ${id}`);
                return res.status(200).json({ success: true, jobs: [], totalPages: 0, message: "No jobs found" });
            }
                logger.info(`Jobs retrieved successfully for recruiter ${id}`);
                res.status(200).json({success:true,message:"Job shows successfully",jobs:jobs.jobs,totalPages:jobs.totalPages})
            
        } catch (error) {
            logger.error(`Error in showJobs: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })
        }
    },
    showIndividualJob:async(req,res)=>{
        try {
            const {id}=req.params
            const job=await jobUseCase.getJobById(id)
            if(job.message){
                logger.warn(`Error fetching job: ${job.message}`)
                return res.status(400).json({success:false,message:job.message})
            }
            logger.info(`Job fetched successfully: ${id}`)
            return res.status(200).json({success:true,message:"Job fetch successfully",job})
        } catch (error) {
            logger.error(`Error in showJobs: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })
        }
    },
    deleteJob:async(req,res)=>{
        try {
            const {id}=req.params
            const result=await jobUseCase.deleteJob(id)
            if(result.message){
                logger.warn(`Job deletion failed - ${result.message}. Job ID: ${id}`);
               return res.status(400).json({success:false,message:result.message})
            }
              logger.info(`Job deleted successfully. Job ID: ${id}`);    
              return res.status(200).json({success:true,message:"Job deleted successfully"})
        } catch (error) {
            logger.error(`Error in delete jobs: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })
        }
    },
    editJob:async(req,res)=>{
        try {
            const{id}=req.params
            const {formData}=req.body
            const result=await jobUseCase.editJob(id,formData)
            if(result.message){
                logger.info(`Successfully updated job with ID:`, { job: result.job });
                return res.status(200).json({success:true,message:result.message,job:result.job})
            }else{
                logger.warn(`Job with ID: not found`);
                return res.status(404).json({ success: false, message: 'Job not found' });
            }
        } catch (error) {
            logger.error(`Error updating job with ID:`, { error });
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }


}
export default jobController