import { Job } from "../../Core/Entities/jobCollection.js";
import { Company } from "../../Core/Entities/companyCollection.js";
import logger from "../Utilis/logger.js";
import { Review } from "../../Core/Entities/reviewCollection.js";
import mongoose from "mongoose";
const jobRepository = {

    createJob: async (jobDetails) => {
        try {
            const newJob = new Job(jobDetails)
            await newJob.save()
            logger.info(`Created new job: ${newJob._id}`);
            return newJob
        } catch (error) {
            logger.error(`Error creating job: ${error}`);
        }
    },
    deleteExpiredJobs:async(currentDate)=>{
        try {
            const result=await Job.deleteMany({expiryDate:{$lt:currentDate}})
            return result.deletedCount;
        } catch (error) {
            logger.error(`Error deleting expired jobs: ${error.message}`);
        }
    },
    findCompanyByName:async(companyName)=>{
        try {
            const company=await Company.findOne({companyName:companyName})            
            if(company){
                logger.info(`Company found: ${company._id}`);
            }else{
                logger.warn(`Company not found for name: ${companyName}`);
            }
            return company._id
        } catch (error) {
            logger.error(`Error finding company by name ${companyName}: ${error.message}`);
        }
    },
    getJobs: async (page,limit) => {
        try {
            const skip=(page-1)*limit
            const jobs = await Job.find({}).sort({ createdAt: -1 })
            .skip(skip).limit(limit)
            const total=await Job.countDocuments()
            logger.info(`Retrieved ${jobs.length} jobs`);
            return {jobs,total}
        } catch (error) {
            logger.error(`Error retrieving jobs: ${error}`);
        }
    },
    getJobDetailsById:async(id)=>{
        try {
            const job=await Job.findById({_id:id}).populate({path:'jobReports.reportedBy',select:'username email'})
            logger.info(`Retrieved ${id} job`);
            return job
        } catch (error) {
            logger.error(`Error retrieving job: ${error}`);

        }
    },
    getJobsById: async (query, page, limit) => {
        try {
            const skip = (page - 1) * limit; 
            const jobs = await Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
            const totalJobs = await Job.countDocuments(query); 
            const totalPages = Math.ceil(totalJobs / limit); 
            logger.info(`Retrieved jobs with query: ${JSON.stringify(query)}`);
            return { jobs, totalPages };
        } catch (error) {
            logger.error(`Error retrieving jobs by ID: ${error}`);
        }
    },
    getJobById:async(id)=>{
        try {
            const job=await Job.findById({_id:id})
            logger.info(`Retrieved job: ${id}`);
            return job
        } catch (error) {
            logger.error(`Error retrieving jobs by ID: ${error}`);
        }
    },
    deleteJobById:async(id)=>{
        try {
            const deleteJob=await Job.findByIdAndDelete({_id:id})
            if(deleteJob){
                logger.info(`Job with ID ${id} deleted successfully.`)
            }else{
                logger.warn(`Job with ID ${id} not found.`);
            }
            return deleteJob
        } catch (error) {
            logger.error(`Error deleting job with ID ${id}: ${error.message}`);
        }
    },
    editJob:async(id,formData)=>{
        try {
            const updatedJob=await Job.findByIdAndUpdate({_id:id},formData,{new:true})
            if (updatedJob) {
                logger.info(`Successfully updated job with ID: ${id}`, { updatedJob });
                return updatedJob;
              } else {
                logger.warn(`Job with ID: ${id} not found`);
              }
            return updatedJob
        } catch (error) {
            logger.error(`Error updating job with ID: ${id}`, { error });
        }
    },
    reportJob:async(jobId,reportedData)=>{
        try {
            const job=await Job.findById({_id:jobId})
            if(job){
                job.jobReports.push(reportedData);
                job.reportCount += 1
                await job.save();
                logger.info(`Job reported successfully: ${jobId}`);
                return job ;
            }else{
                logger.warn(`Job with ID: ${jobId} not found`);
            }
        } catch (error) {
            logger.error(`Error reporting job: ${error.message}`);
        }
    },
    findUserReviewForCompany:async(reviewerId,companyId)=>{
        try {
            const existingReview=await Review.findOne({reviewerId:reviewerId,company:companyId})
            return existingReview
        } catch (error) {
            logger.error(`Error finding user review: ${error.message}`);
        }

    },
    addReviewAndRating:async(data)=>{
        try {
            let result=new Review(data)
            await result.save()
            logger.info(`Review added successfully: ${JSON.stringify(data)}`);
            return result;
        } catch (error) {
            logger.error(`Error add review job: ${error.message}`);
        }
    },
    addReviewToCompany:async(company,id)=>{
        try {
           const result= await Company.findByIdAndUpdate({_id:company},{$push:{reviewsId:id}},{new:true})
           if(result){
            logger.info('Successfully added review to company')
           }else{
              logger.warn('Company not found or review not added')
           }
           return result
        } catch (error) {
            logger.error(`Error add review to company: ${error.message}`);
        }
    },
    getIndividualReviewsOfUser:async(userId)=>{
        try {
            const reviews = await Review.find({ reviewerId: userId }).populate('company', 'companyName');
            if (reviews.length > 0) {
                logger.info(`Retrieved ${reviews.length} reviews for user: ${userId}`);
                return reviews;
            } else {
                logger.warn(`No reviews found for user: ${userId}`);
                return [];
            }     
           } catch (error) {
            logger.error(`Error retrieving individual reviews for user ${userId}: ${error.message}`);
        }
    },
    deleteReview:async(reviewId)=>{ 
        try {
            const objectId = mongoose.Types.ObjectId.isValid(reviewId) ? new mongoose.Types.ObjectId(reviewId) : null;
            const review=await Review.findByIdAndDelete({_id:objectId})
            if (review) {
                logger.info(`Review with ID ${reviewId} deleted successfully.`);
                return review;
            } else {
                logger.warn(`Review with ID ${reviewId} not found.`);
                return null;
            }
            } catch (error) {
                logger.error(`Error deleting review with ID ${reviewId}: ${error.message}`);
        }
    },
    updateReviewById:async(reviewId, updateData)=>{
        try {
            const updatedReview = await Review.findByIdAndUpdate(reviewId, { $set: updateData }, { new: true });
            if (updatedReview) {
                logger.info(`Successfully updated review with ID: ${reviewId}`, { updatedReview });
                return updatedReview;
            } else {
                logger.warn(`Review with ID: ${reviewId} not found`);
                return null;
            }
        } catch (error) {
            logger.error(`Error updating review with ID ${reviewId}: ${error.message}`);
        }
    }



}
export default jobRepository