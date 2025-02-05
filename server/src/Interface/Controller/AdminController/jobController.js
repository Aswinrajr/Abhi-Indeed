import adminUseCase from "../../../Application/Usecase/adminUsecase.js";
import jobUseCase from "../../../Application/Usecase/jobUsecase.js";
import logger from "../../../Framework/Utilis/logger.js"
const jobController={
    getAllJobs:async(req,res)=>{
        try {
            const page=parseInt(req.query.page) || 1
            const limit=parseInt(req.query.limit) || 10
            const search = req.query.search || ''; 
            const category = req.query.category || '';
            const jobs=await adminUseCase.getAllJobs(page,limit,search,category)
            logger.info(`Retrieved all jobs, count: ${jobs.length}`);
            res.status(200).json({success:true,jobs:jobs.jobs,total:jobs.total,page:jobs.page,limit:jobs.limit})  
        } catch (error) {
            logger.error(`Error in getAllJobs: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })  
        }
    },
    getIndividualJob:async(req,res)=>{
        try {
            const {id}=req.params
            const job=await jobUseCase.getJobById(id)
            if(job.message){
                logger.warn(`Error fetching job: ${job.message}`)
                return res.status(400).json({success:false,message:job.message})
            }
            logger.info(`Job fetched successfully: ${id}`)
            return res.status(200).json({success:true,message:"Job fetch successfully",job:job})
        } catch (error) {
            logger.error(`Error in get job: ${error.message}`);
            res.status(500).json({ message: "Internal server error" }) 
        }
    },
    listOrUnlistJobs:async(req,res)=>{
        try {
            const {id}=req.params
            const result=await adminUseCase.jobListOrUnlist(id)
            if(result.message){
                return res.status(400).json({ success: false, message: result.message });
            }
            res.status(200).json({ success: true, delete: result.delete });
        } catch (error) {
            logger.error(`Error listing/Unlisting job: ${error.message}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}
export default jobController