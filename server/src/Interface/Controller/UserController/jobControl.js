import logger from "../../../Framework/Utilis/logger.js";
import jobUseCase from "../../../Application/Usecase/jobUsecase.js";
import categoryUseCase from "../../../Application/Usecase/categoryUsecase.js";
import applicationUseCase from "../../../Application/Usecase/applicationUsecase.js";
import jobRepository from "../../../Framework/Repositories/jobRepository.js";
import mongoose from "mongoose";

const jobControl={
    getIndividualJob:async(req,res)=>{
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
    applyJob:async(req,res)=>{
        try {
            const jobId=req.query.jobid            
            const recruiterid=req.query.recruiterid
            const jobData={...req.body,applicant:req.user.user._id}
            if (jobData.dob) {
                const [day, month, year] = jobData.dob.split('/').map(Number);
                jobData.dob = new Date(year, month - 1, day); 
            }
            const application=await jobUseCase.applyJob(jobId,recruiterid,jobData)
            if(application.message){
                logger.warn(`Error in job posting: ${application.message}`)
                return res.status(400).json({success:false,message:application.message})
            }
            logger.info(`Job applyed successfully`)
            return res.status(200).json({success:true,message:"Job posted successfully",application})
        } catch (error) {
            logger.error(`Error in apply job: ${error}`);
            res.status(500).json({ message: "Internal server error" })
        }
    },
    checkAlreadyApplied:async(req,res)=>{
        try {
            const jobId=req.params
            const userId=req.user.user._id
            const validJobId = mongoose.Types.ObjectId.isValid(jobId) ? new mongoose.Types.ObjectId(jobId) : null;
            const result=await applicationUseCase.checkAlreadyApplied(validJobId,userId)
            if (result.error) {
                logger.warn(`Failed to check if user ${userId} applied for job ${jobId}: ${result.error}`);
                return res.status(400).json({ success: false, message: result.error });
            }
            if (result.hasApplied) {
                logger.info(`User ${userId} has already applied for job ${validJobId}`);
                return res.status(200).json({ success: true, hasApplied: true, message: result.message });
            }
            logger.info(`User ${userId} has not applied for job ${jobId}`);
            return res.status(200).json({ success: true, hasApplied: false });
        } catch (error) {
            logger.error(`Error checking if user ${userId} applied for job ${jobId}: ${error.message}`);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    getUnappliedJobs:async(req,res)=>{
        try {
            let userId=req.user.user._id
            const jobs=await applicationUseCase.getUnappliedJobs(userId)
            if (jobs) {
                logger.info(`Successfully fetched unapplied jobs for user ${userId}. Total jobs: ${jobs.length}`);
                return res.status(200).json({ success: true, jobs });
            } else {
                logger.warn(`No unapplied jobs found for user ${userId}`);
                return res.status(404).json({ success: false, message: "No unapplied jobs found" });
            }
        } catch (error) {
            logger.error(`Error fetching unapplied jobs for user ${userId}: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    getCategories:async(req,res)=>{
        try {
            const categories=await categoryUseCase.getAllCategoriesForRecruiter()
            logger.info('Categories retrieved successfully')
            return res.status(200).json({success:true,categories})
        } catch (error) {
            logger.error(`Error in fetching categories: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    getApplications:async(req,res)=>{
        try {
            const page=parseInt(req.query.page) || 1
            const limit=parseInt(req.query.limit) || 10
            const userId=req.user.user._id
            const applications=await applicationUseCase.getApplicationforCandidates(userId,page,limit)
            if(applications.message){
                logger.warn(`Failed to fetch applications for candidate ID: ${userId} - ${applications.message}`);
                return res.status(400).json({success:false,message:applications.message})
            }else{
                logger.info(`Applications fetched successfully for candidate ID: ${userId}`);
                 return res.status(200).json({success:true,message:"Job fetch successfully",applications:applications.application,total:applications.total,page:applications.page,limit:applications.limit})
            }
        } catch (error) {
            logger.error(`Error fetching applications for candidate ID: ${userId} - ${error.message}`);
            return res.status(500).json({ success: false, message: "Internal Server Error" });   
        }
    },
    getSearchApplication:async(req,res)=>{
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const searchTerm = req.query.searchTerm
            const userId=req.user.user._id            
            const applications=await applicationUseCase.getSearchApplication(userId, page, limit, searchTerm)
            if (applications.message) {
                logger.warn(`Failed to fetch applications for candidate ID: ${userId} - ${applications.message}`);
                return res.status(400).json({ success: false, message: applications.message });
            } else {
                logger.info(`Applications fetched successfully for candidate ID: ${userId}`);
                return res.status(200).json({
                    success: true,
                    message: "Job fetch successfully",
                    applications: applications.application,
                    total: applications.total,
                    page: applications.page,
                    limit: applications.limit
                });
            }
        } catch (error) {
            logger.error(`Error fetching applications for candidate ID: - ${error.message}`);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },
    reportJob: async (req, res) => {
        try {
            const { jobId, reason, description } = req.body;
            const userId = req.user.user._id;
    
            const result = await jobUseCase.reportJob(jobId, userId, reason, description);
    
            if (!result.success) {
                logger.warn(result.message);
                return res.status(400).json({ success: false, message: result.message });
            }
    
            logger.info(`Job reported successfully: ${jobId}`);
            return res.status(200).json({ success: true, message: "Job reported successfully", job: result.job });
    
        } catch (error) {
            logger.error(`Error reporting job: ${error.message}`);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    checkIfReported:async(req,res)=>{
        try {
            const {id}=req.params
            const userId=req.user.user._id
            const job=await jobRepository.getJobById(id)
            const hasReported=job.jobReports.some(report=>report.reportedBy.toString()===userId.toString())
            logger.info(`Check if reported - User ${userId} has ${hasReported ? '' : 'not '}reported job ${id}`);
            res.status(200).json({ success: true, hasReported });
        } catch (error) {
            logger.error(`Error in checkIfReported: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    checkReviewExists:async(req,res)=>{
        try {
            const reviewerId=req.user.user._id
            const {companyId}=req.params
            const existingReview=await jobUseCase.checkUserReviewExists(reviewerId,companyId)
            if (existingReview) {
                logger.info(`User ${reviewerId} has already added a review for company ${companyId}`);
                return res.status(200).json({ success: true, message: "Review already exists", hasReviewed: true });
            } else {
                logger.info(`User ${reviewerId} has not added a review for company ${companyId}`);
                return res.status(200).json({ success: true, message: "No review exists", hasReviewed: false });
            }
        } catch (error) {
            logger.error(`Error checking if review exists: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    addReviewAndRating:async(req,res)=>{
        try {
            const reviewerName=req.user.user.username
            const reviewerId=req.user.user._id
            const {reviewData}=req.body
            const existingReview=await jobUseCase.checkUserReviewExists(reviewerId,reviewData.company)
            if (existingReview) {
                logger.warn('User has already submitted a review for this company');
                return res.status(400).json({ success: false, message: 'You have already submitted a review for this company' });
              }
            const result=await jobUseCase.addReviewAndRating(reviewerName,reviewerId,reviewData)            
            if(result){
                logger.info('Review added successfully');
                return res.status(200).json({success:true,message:"Review added successfully"})
            }else{
                logger.warn('Error while adding review');
                return res.status(400).json({success:false,message:"Review not added"})  
            }
        } catch (error) {
            logger.error(`Error adding review: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    getIndividualReviews:async(req,res)=>{
        try {
            const userId=req.user.user._id
            const result=await jobUseCase.getIndividualReviews(userId)
            if (result) {
                logger.info(`Reviews fetched successfully for user ID: ${userId}`);
                return res.status(200).json({ success: true, reviews: result });
            } else {
                logger.warn(`No reviews found for user ID: ${userId}`);
                return res.status(404).json({ success: false, message: "No reviews found" });
            }
        } catch (error) {
            logger.error(`Error in getIndividualReviews: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    deleteIndividualReview:async(req,res)=>{
        try {
            const {reviewId}=req.params
            const result=await jobUseCase.deleteIndividualReview(reviewId)
            if (result) {
                logger.info(`Review ID: ${reviewId} deleted successfully`);
                return res.status(200).json({ success: true, message: "Review deleted successfully" });
            } else {
                logger.warn(`Failed to delete review ID: ${reviewId}`);
                return res.status(400).json({ success: false, message: "Review not found" });
            }
        } catch (error) {
            logger.error(`Error in deleteIndividualReview: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    updateReview:async(req,res)=>{
        try {
            const{reviewId}=req.params
            const {rating,comment}=req.body
            const updatedReview=await jobUseCase.updateReview(reviewId,rating,comment)
            if (updatedReview) {
                logger.info(`Review ID: ${reviewId} updated successfully`);
                return res.status(200).json({ success: true, message: "Review updated successfully" });
            } else {
                logger.warn(`Failed to update review ID: ${reviewId}`);
                return res.status(400).json({ success: false, message: "Review not found" });
            }
        } catch (error) {
            logger.error(`Error updating review ID: ${reviewId}: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

}
export default jobControl