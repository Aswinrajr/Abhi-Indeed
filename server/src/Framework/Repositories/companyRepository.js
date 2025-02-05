import { Company } from "../../Core/Entities/companyCollection.js";
import { Job } from "../../Core/Entities/jobCollection.js";
import { Recruiter } from "../../Core/Entities/recruiterCollection.js";
import { Review } from "../../Core/Entities/reviewCollection.js";
import logger from "../Utilis/logger.js";

const companyRepository={

    findExistingCompany:async(companyName,email)=>{
        try {
            const existingCompany = await Company.findOne({
                $or: [
                    { companyName: { $regex: new RegExp(`^${companyName}$`, 'i') } },
                    { email: { $regex: new RegExp(`^${email}$`, 'i') } }
                ]
            });
            if(existingCompany){
                if (existingCompany.companyName.toLowerCase() === companyName.toLowerCase()) {
                    logger.info(`Company found with name: ${existingCompany.companyName}`);
                }
                if (existingCompany.email.toLowerCase() === email.toLowerCase()) {
                    logger.info(`Company found with email: ${existingCompany.email}`);
                }         
               }else{
                logger.info(`No company found with name: ${companyName}`);
               }
            return existingCompany
        } catch (error) {
            logger.error('Error finding company:', error);
        }
    },
    createNewCompany:async(companyData)=>{
        try {
            const newCompany=new Company(companyData)
            await newCompany.save()
            logger.info(`Company created successfully: ${newCompany.companyName}`);
            return newCompany
        } catch (error) {
            logger.error('Error creating new company:', error);
        }
    },
    findCompanyByEmail:async(email)=>{
        try {
            const company=await Company.findOne({email:email})
            if (company) {
                logger.info(`Company found with email: ${email}`);
              } else {
                logger.info(`No company found with email: ${email}`);
              }
            return company
        } catch (error) {
            logger.error(`Error finding company by email: ${error.message}`);
        }
    },
    getAllCompanies:async()=>{
        try {
            const companies=await Company.find({},'companyName')
            logger.info(`Fetched ${companies.length} companies`);
            return companies.map(company=>company.companyName)
        } catch (error) {
            logger.error(`Error fetching company names: ${error.message}`);
        }
    },
    findCompanyByid:async(id)=>{
        try {
            const company=await Company.findById({_id:id}).populate('reviewsId')
            if (company) {
                logger.info(`Company found with id: ${id}`);
              } else {
                logger.info(`No company found with id: ${id}`);
              }
            return company
        } catch (error) {
            logger.error(`Error finding company by id: ${error.message}`);
        }
    },
    updateProfile:async(email,updateCompanyDetails)=>{
        try {
            const company=await Company.findOneAndUpdate({email:email},updateCompanyDetails,{new:true})
            logger.info(`Company contact updated for email: ${email}`);
            return company
        } catch (error) {
            logger.error(`Error during updating company details for email: ${email}, error: ${error.message}`);
        }
    },
    updateAboutDetails:async(email,formData)=>{
        try {
            const aboutData=await Company.findOneAndUpdate({email:email},formData,{new:true})
            logger.info(`Company about updated for email: ${email}`);
            return aboutData
        } catch (error) {
            logger.error(`Error during updating company about for email: ${email}, error: ${error.message}`);
        }
    },
    uploadCompanyDocuments:async(companyId, docType, fileUrl)=>{
        try {
            const update = {};
            update[docType] = fileUrl;
            const updatedCompany = await Company.findByIdAndUpdate(companyId, update, { new: true });
            if (updatedCompany) {
                logger.info(`Document ${docType} uploaded successfully for company ID: ${companyId}`);
            } else {
                logger.warn(`No company found to upload document for ID: ${companyId}`);
            }
            return updatedCompany;
        } catch (error) {
            logger.error(`Error uploading document for company ID: ${companyId}, error: ${error.message}`);
        }
    },
    deleteCompanyDocument: async (companyId, docType) => {
        try {
            const update = {};
            update[docType] = "";  
            const updatedCompany = await Company.findByIdAndUpdate(companyId, update, { new: true });
            if (updatedCompany) {
                logger.info(`Document ${docType} deleted successfully for company ID: ${companyId}`);
            } else {
                logger.warn(`No company found to delete document for ID: ${companyId}`);
            }
            return updatedCompany;
        } catch (error) {
            logger.error(`Error deleting document for company ID: ${companyId}, error: ${error.message}`);
        }
    },    
    getAllCompaniesForUser:async()=>{
        try {
            const companies=await Company.find().populate('reviewsId')
            if (companies.length > 0) {
                logger.info(`Fetched ${companies.length} companies with reviews`);
            } else {
                logger.info('No companies found');
            }
            return companies;
        } catch (error) {
            logger.error(`Error fetching companies for user: ${error.message}`);
        }
    },
    getCompanyReviews:async(id)=>{
        try {
            const reviews=await Review.find({company:id})
            if (reviews.length > 0) {
                logger.info(`Fetched ${reviews.length} reviews for company ID: ${id}`);
            } else {
                logger.info(`No reviews found for company ID: ${id}`);
            }
            return reviews;
        } catch (error) {
            logger.error(`Error fetching reviews for company ID: ${id}, error: ${error.message}`);
        }
    },
    countRecruiters:async(companyName)=>{
        try {
            const recruitersCount = await Recruiter.countDocuments({ companyName: companyName });
            logger.info(`Counted ${recruitersCount} recruiters for company name: ${companyName}`);
            return recruitersCount;
        } catch (error) {
            logger.error(`Error counting recruiters for company name: ${companyName}, error: ${error.message}`);
        }
    },
    countJobs:async(companyName)=>{
        try {
            const jobsCount = await Job.countDocuments({ companyName: companyName });
            logger.info(`Counted ${jobsCount} jobs for company name: ${companyName}`);
            return jobsCount;
        } catch (error) {
            logger.error(`Error counting jobs for company name: ${companyName}, error: ${error.message}`);
        }
    },
    uploadCompanyLogo:async(companyId,logoUrl)=>{
        try {
            const companyLogo=await Company.findByIdAndUpdate(companyId,{logo:logoUrl},{new:true})
            if (companyLogo) {
                logger.info(`Company logo updated successfully for company ID: ${companyId}`);
            } else {
                logger.warn(`No company found to update logo for ID: ${companyId}`);
            }
            return companyLogo
        } catch (error) {
            logger.error(`Error uploading company logo for company ID: ${companyId}, error: ${error.message}`);
        }
    },
    deleteReviewFromCompany:async(reviewId)=>{
        try {
            const result=await Company.updateMany(
                {reviewsId:reviewId},
                {$pull:{reviewsId:reviewId}}
                 )
                 logger.info(`Removed review with ID ${reviewId} from companies.`);
            return result;
        } catch (error) {
            logger.error(`Error removing review from companies: ${error.message}`);
        }
    },
    getRecruiters:async(companyName,page,limit)=>{
        try {
        const skip=(page-1)*limit
        const recruiters=await Recruiter.find({companyName:companyName}).skip(skip).limit(limit)
        const total=await Recruiter.countDocuments({companyName:companyName})
        if (recruiters.length > 0) {
            logger.info(`Fetched ${recruiters.length} recruiters for company name: ${companyName}, page: ${page}, limit: ${limit}`);
        } else {
            logger.info(`No recruiters found for company name: ${companyName}, page: ${page}`);
        }
        return {recruiters,total}
        } catch (error) {
            logger.error(`Error fetching recruiters for company name: ${companyName}, error: ${error.message}`);
        }   
    },
    deleteRecruiterById:async(id)=>{
        try {
            const recruiter=await Recruiter.findByIdAndDelete({_id:id})
            if (!recruiter) {
                logger.error(`Recruiter with ID ${id} not found`);
            }
            logger.info(`Recruiter with ID ${id} successfully deleted`);
            return recruiter
        } catch (error) {
            logger.error(`Error deleting recruiter with ID ${id}: ${error.message}`);
        }
    }
    
}

export default companyRepository