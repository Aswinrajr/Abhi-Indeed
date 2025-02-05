import { Application } from "../../Core/Entities/applicationCollection.js"
import { Job } from "../../Core/Entities/jobCollection.js"
import logger from "../Utilis/logger.js"


const applicationRepository={
    postApplication:async(applicationData)=>{
        try {
            const newApplication = new Application(applicationData)
            await newApplication.save()
            logger.info(`Created jobApplication: ${newApplication._id}`);
            return newApplication
        } catch (error) {
            logger.error(`Error in applying job: ${error}`);
        }
    },
    getApplicationByRecruiter:async(id)=>{
        try {
            const application=await Application.find({jobId:id}).populate('jobId')          
            if(!application){
                logger.warn(`No applications found for job ID: ${id}`);
            }else{
                logger.info(`Fetched applications for job ID: ${id}`);
            }
            return application
        } catch (error) {
            logger.error(`Error fetching applications for job ID: ${id} - ${error.message}`);
        }
    },
    updateApplicationStatus:async(id,status)=>{
        try {
            const updatedStatus=await Application.findByIdAndUpdate({_id:id},{status:status},{new:true})
            if (!updatedStatus) {
                logger.warn(`Application with ID: ${id} not found for status update`);
            } else {
                logger.info(`Application status updated successfully for ID: ${id} to ${status}`);
            }
            return updatedStatus
        } catch (error) {
            logger.error(`Error updating application status for ID: ${id} - ${error.message}`);
        }

    },
    getApplicationDetails:async(id)=>{
        try {
            const application=await Application.findOne({_id:id}).populate('jobId')
            if(!application){
                logger.warn(`No application found for application ID: ${id}`);
            } else {
                logger.info(`Fetched application details for application ID: ${id}`);
            }
            return application
        } catch (error) {
            logger.error(`Error fetching application details for application ID: ${id} - ${error.message}`);
        }
    },
    getApplicationforCandidates:async(id,page,limit)=>{
        try {
            const skip=(page-1)*limit
            const application=await Application.find({applicant:id}).populate('jobId').sort({ createdAt: -1 }).skip(skip).limit(limit);
            const total=await Application.countDocuments({applicant:id})
            if(!application){
                logger.warn(`No applications found for candidate ID: ${id}`);
            }else{
                logger.info(`Fetched applications for candidate ID: ${id}`);
            }
            return {application,total}
        } catch (error) {
            logger.error(`Error fetching applications for candidate ID: ${id} - ${error.message}`);
        }
    },
    getSearchedApplication: async (id, page, limit, searchTerm) => {
        try {    
            const skip = (page - 1) * limit;
            const searchFilter =  {
                    applicant: id,
                    $or: [
                        { 'jobId.jobTitle': { $regex: searchTerm, $options: 'i' } }, 
                        { 'jobId.companyName': { $regex: searchTerm, $options: 'i' } } 
                    ]
                  }
                ;
            const application = await Application.aggregate([
                { $match: { applicant:id } }, // Match based on applicant ID
                { 
                    $lookup: {
                        from: 'jobs', // Your Job collection
                        localField: 'jobId',
                        foreignField: '_id',
                        as: 'jobInfo'
                    }
                },
                { $unwind: '$jobInfo' }, // Unwind the job info
                {
                    $match: searchTerm ? {
                        $or: [
                            { 'jobInfo.jobTitle': { $regex: searchTerm, $options: 'i' } }, // Search job title
                            { 'jobInfo.companyName': { $regex: searchTerm, $options: 'i' } } // Search company name
                        ]
                    } : {}
                },
                { $skip: skip },
                { $limit: limit }
            ]);
    
            const total = await Application.aggregate([
                { $match: { applicant:id } },
                { 
                    $lookup: {
                        from: 'jobs',
                        localField: 'jobId',
                        foreignField: '_id',
                        as: 'jobInfo'
                    }
                },
                { $unwind: '$jobInfo' },
                {
                    $match: searchTerm ? {
                        $or: [
                            { 'jobInfo.jobTitle': { $regex: searchTerm, $options: 'i' } },
                            { 'jobInfo.companyName': { $regex: searchTerm, $options: 'i' } }
                        ]
                    } : {}
                },
                { $count: 'total' }
            ]);
    
                const totalCount = total.length > 0 ? total[0].total : 0;
    
            if (application.length === 0) {
                logger.warn(`No applications found for candidate ID: ${id}`);
                return { message: "Application not found", application: [], total: 0 };
            } else {
                logger.info(`Fetched applications for candidate ID: ${id}`);
                return { application, total: totalCount };
            }
        } catch (error) {
            logger.error(`Error fetching applications for candidate ID: ${id} - ${error.message}`);
        }
    },
    findAlreadyApply:async(jobId,userId)=>{
        try {
            const existingApplication=await Application.findOne({jobId:jobId,applicant:userId})
            if(existingApplication){
                logger.info(`User ${userId} has already applied for job ${jobId}`);
            } else {
                logger.info(`User ${userId} has not applied for job ${jobId}`);
            }
            return existingApplication
        } catch (error) {
            logger.error(`Error checking application status for user ${userId} on job ${jobId}: ${error.message}`);
        }
    },
    getUnappliedJobs:async(id)=>{
        try {
            const appliedJobs=await Application.find({applicant:id}).select('jobId')
            const appliedJobIds=appliedJobs.map(app=>app.jobId)
            const jobs=await Job.find({_id:{$nin:appliedJobIds},delete:false}).sort({createdAt:-1})
            logger.info(`Fetched unapplied jobs for user ${id}. Applied jobs: ${appliedJobIds.length}, Unapplied jobs: ${jobs.length}`);
            return jobs
        } catch (error) {
            logger.error(`Error fetching unapplied jobs for user ${userId}: ${error.message}`);
        }
    }

}
export default applicationRepository