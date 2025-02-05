
import jobRepository from "../../Framework/Repositories/jobRepository.js";
import applicationRepository from "../../Framework/Repositories/applicationRepository.js";
import uploadFileToS3 from "../../Framework/Services/s3.js";
import logger from "../../Framework/Utilis/logger.js";
import { Job } from "../../Core/Entities/jobCollection.js";
import companyRepository from "../../Framework/Repositories/companyRepository.js";

const jobUseCase = {
    postJob: async (jobData) => {
        try {
            const { jobTitle, companyName, minPrice, maxPrice, jobLocation, yearsOfExperience, category,employmentType, description, jobPostedBy,education, skills,easyApply,applicationUrl,expiryDate } = jobData
            const companyId=await jobRepository.findCompanyByName(companyName)
            const newJob = await jobRepository.createJob({
                company:companyId,
                jobTitle: jobTitle,
                companyName,
                minPrice: minPrice,
                maxPrice: maxPrice,
                jobLocation: jobLocation,
                yearsOfExperience: yearsOfExperience,
                employmentType: employmentType,
                description: description,
                skills: skills,
                education:education,
                categoryName:category,
                jobPostedBy,
                easyApply,
                applicationUrl,
                expiryDate
            }
            )            
            if (!newJob) {
                logger.warn("Job posting not completed");
                return { message: "Job posted not done /Expiry date must be greater than today." }
            }
            logger.info(`New job posted`)
            return newJob
        } catch (error) {
            logger.error(`Error in postJob: ${error}`);
        }
    },
    getAllJobs: async (page,limit) => {
        try {
            const {jobs,total} = await jobRepository.getJobs(page,limit)
            const activeJobs=jobs.filter(job=>!job.delete)
            logger.info(`Retrieved ${activeJobs.length} active jobs out of ${total} total jobs`);
            return {activeJobs,total}
        } catch (error) {
            logger.error(`Error in getAllJobs: ${error}`);
        }
    },
    getJobById:async(id)=>{
        try {
            const job=await jobRepository.getJobDetailsById(id)
            if(!job){
                return ({message:"Job not found"})
            }
            logger.info(`Retrieved ${id} successfully`);
            return job
        } catch (error) {
            logger.error(`Error in getJob: ${error}`);
        }
    },
    showJobs: async (id, { page, limit, searchTerm }) => {
        try {
            const query = { jobPostedBy: id };
            if (searchTerm) {
                query.jobTitle = { $regex: searchTerm, $options: 'i' };
            }
            const { jobs, totalPages }  = await jobRepository.getJobsById(query, page, limit)
            if (!jobs.length) {
                logger.warn(`No jobs found for user ID: ${id}`);
                return { jobs: [], totalPages: 0,  message: "No jobs found" }
            }
            logger.info(`Retrieved jobs for user ID: ${id}`);
            return  { jobs, totalPages };
        } catch (error) {
            logger.error(`Error in showJobs: ${error}`);
        }
    },
    deleteJob:async(id)=>{
        try {
            const job=await jobRepository.getJobById(id)
            if(!job){
             logger.warn(`Attempt to delete job failed - Job not found or unauthorized. Job ID: ${id}`);         
             return {message: 'Job not found or unauthorized' };
             }
             let deletedJob=await jobRepository.deleteJobById(id)
             logger.info(`Job deleted successfully. Job ID: ${id}`);
             return deletedJob
        } catch (error) {
            logger.error(`Error deleting job with ID ${id}: ${error.message}`);
        }
    },
    editJob:async(id,formData)=>{
        try {
            const job=await jobRepository.editJob(id,formData)
            if (job) {
                logger.info(`Successfully updated job with ID: ${id}`, { job });
                return {message:"Job updated successfully",job}
              } else {
                logger.warn(`Job with ID: ${id} not found`);
              }
        } catch (error) {
            logger.error(`Error updating job with ID: ${id}`, `${error.message}`);
        }
    },
    applyJob:async(jobId,recruiterid,jobData)=>{
        try {
            const {name,email,contact,dob,totalExperience,currentCompany,currentSalary,expectedSalary,preferredLocation,resume,applicant}=jobData
            const job=await Job.findById({_id:jobId})
            if (!job) {
                logger.warn(`Job not found with ID: ${jobId}`);
                return { message: "Job not found" };
            }
            const existingApplication=await applicationRepository.findAlreadyApply(jobId,applicant)
            if(existingApplication){
                logger.info(`User ${applicant} has already applied for job with ID: ${jobId}`);
                return { message: "You have already applied for this job" };
            }
            const newApplication=await applicationRepository.postApplication({
                name,
                email,
                contact,
                dob,
                totalExperience,
                currentCompany,
                currentSalary,
                expectedSalary,
                preferredLocation,
                resume,
                applicant,
                jobId:jobId,
                employerId:recruiterid,
                companyId:job.company
            })
            if (!newApplication) {
                logger.warn("Application posting not completed");
                return { message: "Application posted not done" }
            }
            logger.info(`New job application posted`)
            return newApplication
        } catch (error) {
            logger.error(`Error in postJobApplication: ${error}`);
        }
    },
    reportJob: async (jobId, userId, reason, description) => {
        try {
            let job = await jobRepository.getJobById(jobId);
            
            if (!job) {
                logger.warn(`Job with ID: ${jobId} not found`);
                return { success: false, message: "Job not found" };
            }
    
            const hasReported = job.jobReports.some(report => report.reportedBy.toString() === userId.toString());
    
            if (hasReported) {
                logger.info(`User with ID: ${userId} has already reported job with ID: ${jobId}`);
                return { success: false, message: "You have already reported this job." };
            }
    
            const reportedData = {
                reportedBy: userId,
                reason: reason,
                description: description
            };
            const result = await jobRepository.reportJob(jobId, reportedData)
            if (!result) {
                return { success: false, message: "Job reporting failed" };
            }
            logger.info(`Job reported successfully: ${jobId}`);
            return { success: true, job: result.job };
    
        } catch (error) {
            logger.error(`Error reporting job: ${error.message}`);
            return { success: false, message: "Internal server error" };  
        }
    },
    checkUserReviewExists:async(reviewerId,companyId)=>{
        try {
            const existingReview=await jobRepository.findUserReviewForCompany(reviewerId,companyId)
            if (existingReview) {
                logger.info(`User ${reviewerId} has already submitted a review for company ${companyId}`);
                return true;
              }
              return false;
        } catch (error) {
            logger.error(`Error checking user review: ${error.message}`);
        }
    },
    addReviewAndRating:async(reviewerName,reviewerId,reviewData)=>{
        try {
            const {rating,comment,company}=reviewData
            const result=await jobRepository.addReviewAndRating({
                reviewerName:reviewerName,
                reviewerId:reviewerId,
                rating:rating,
                comment:comment,
                company:company
            })
            logger.info('Review added successfully for reviewer: ${reviewerName}')
            await jobRepository.addReviewToCompany(company,result._id)
               logger.info('Review associated with company successfully')
               return result
        } catch (error) {
            logger.error(`Error adding review and rating': ${error.message}`)
        }
    },
    getIndividualReviews:async(userId)=>{
        try {
            const reviews=await jobRepository.getIndividualReviewsOfUser(userId)
            if (!reviews) {
                logger.warn(`No reviews found for user ID: ${userId}`);
                return { message: "No reviews found" };
            }
            logger.info(`Retrieved reviews for user ID: ${userId}`);
            return reviews;
        } catch (error) {
            logger.error(`Error in getIndividualReviews: ${error.message}`);
            return { message: "Internal server error" };
        }
    },
    deleteIndividualReview:async(reviewId)=>{
        try {
            const reviewDeleted=await jobRepository.deleteReview(reviewId)
            if (!reviewDeleted) {
                logger.warn(`Review with ID: ${reviewId} not found or failed to delete`);
                return { message: "Review not found or failed to delete" };
            }
            await companyRepository.deleteReviewFromCompany(reviewId)
            logger.info(`Successfully deleted review with ID: ${reviewId}`);
            return { message: "Review deleted successfully" }
        } catch (error) {
            logger.error(`Error deleting review with ID: ${reviewId}. Error: ${error.message}`);
            return { message: "Internal server error" };
        }
    },
    updateReview:async(reviewId,rating,comment)=>{
        try {
            const updatedReview = await jobRepository.updateReviewById(reviewId, { rating, comment });
            if (!updatedReview) {
                logger.warn(`Review with ID: ${reviewId} not found`);
                return { message: "Review not found" };
            }
            logger.info(`Successfully updated review with ID: ${reviewId}`);
            return updatedReview;
        } catch (error) {
            logger.error(`Error updating review with ID: ${reviewId}: ${error.message}`);
            return { message: "Internal server error" };
        }
    }
    
}
export default jobUseCase