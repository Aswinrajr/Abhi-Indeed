import { Admin } from "../../Core/Entities/adminCollection.js";
import { User } from "../../Core/Entities/userCollection.js";
import { Recruiter } from "../../Core/Entities/recruiterCollection.js";
import { Job } from "../../Core/Entities/jobCollection.js";
import { Company } from "../../Core/Entities/companyCollection.js";
import logger from "../Utilis/logger.js";
import { Category } from "../../Core/Entities/categoryCollection.js";

const adminRepository={
   findAdminByEmail:async(email)=>{
     try {
        const admin=await Admin.findOne({email:email})
        logger.info(admin)
        if (admin) {
         logger.info(`Admin found: ${email}`);
       } else {
         logger.warn(`Admin not found: ${email}`);
       }
       return admin
     } catch (error) {
      logger.error(`Error finding admin by email: ${email}, ${error.message}`);     }
   },
   findAllCandidates:async(page,limit)=>{
      try {
         const skip=(page-1)*limit
         const candidates=await User.find().skip(skip).limit(limit)
         const total=await User.countDocuments()
         logger.info(`Found ${candidates.length} candidates`);
         return {candidates,total}
      } catch (error) {
         logger.error(`Error fetching all candidates: ${error.message}`);
         
      }
   },
   findAllRecruiters:async(page,limit,companyName)=>{
      try {
        const skip=(page-1)*limit
        const query = companyName ? { companyName: { $regex: companyName, $options: 'i' } } : {};
         const recruiters=await Recruiter.find(query).skip(skip).limit(limit)
         const total=await Recruiter.countDocuments(query)
         logger.info(`Found ${recruiters.length} recruiters`);
         return {recruiters,total}
      } catch (error) {
         logger.error(`Error fetching all recruiters: ${error.message}`);   
      }
   },
   findAllCompanies:async(page,limit)=>{
    try {
      const skip=(page-1)*limit
      const companies=await Company.find().skip(skip).limit(limit)
      const total=await Company.countDocuments()
      logger.info(`Found ${companies.length} companies`);
         return {companies,total}
    } catch (error) {
      logger.error(`Error fetching all companies: ${error.message}`);   
    }

   },
   getAllJobs:async(page,limit,search,category)=>{
    try {
      const skip=(page-1)*limit
      const query = {
        jobTitle: { $regex: search, $options: 'i' }
    };

    if (category) {
        query.categoryName = category;
    }

      const jobs=await Job.find(query).skip(skip).limit(limit)
      const total=await Job.countDocuments(query)
      logger.info(`Found ${jobs.length} jobs`);
      return {jobs,total}
    } catch (error) {
      logger.error(`Error fetching all jobs: ${error.message}`);   
    }
   },
   findCandidateById:async(id)=>{
      try {
         const candidate=await User.findById({_id:id})
         if (candidate) {
            logger.info(`Candidate found: ${id}`);
          } else {
            logger.warn(`Candidate not found: ${id}`);
          }
          return candidate
      } catch (error) {
         logger.error(`Error finding candidate by ID: ${id}, ${error.message}`);
      }
   },
   findCandidateByIdAndUpdate: async (id, update) => {
      try {
        const candidate = await User.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (candidate) {
          logger.info(`Candidate updated: ${id}`);
        } else {
          logger.warn(`Candidate not found: ${id}`);
        }
        return candidate;
      } catch (error) {
        logger.error(`Error updating candidate by ID: ${id}, ${error.message}`);
      }
    },
    findRecruiterById:async(id)=>{
      try {
         const recruiter=await Recruiter.findById({_id:id})
         if (recruiter) {
            logger.info(`Recruiter found: ${id}`);
          } else {
            logger.warn(`Recruiter not found: ${id}`);
          }
          return recruiter
      } catch (error) {
         logger.error(`Error finding recruiter by ID: ${id}, ${error.message}`);
      }
   },
   findRecruiterByIdAndUpdate: async (id, update) => {
      try {
        const recruiter = await Recruiter.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (recruiter) {
          logger.info(`Recruiter updated: ${id}`);
        } else {
          logger.warn(`Recruiter not found: ${id}`);
        }
        return recruiter;
      } catch (error) {
        logger.error(`Error updating recruiter by ID: ${id}, ${error.message}`);
      }
    },
    findJobByIdAndUpdate:async(id,update)=>{
      try {
        const job=await Job.findByIdAndUpdate(id,{$set:update},{new:true})
        if(job){
          logger.info(`Job updated: ${id}`)
        }else{
          logger.warn(`Recruiter not found: ${id}`);
        }
        return job
      } catch (error) {
        logger.error(`Error updating job by ID: ${id}, ${error.message}`);
      }
    },
    findCompanyByIdAndUpdate:async(id,update)=>{
      try {
        const company=await Company.findByIdAndUpdate(id,{$set:update},{new:true})
        if(company){
          logger.info(`Company updated: ${id}`)
        }else{
          logger.warn(`Company not found: ${id}`);
        }
        return company
      } catch (error) {
        logger.error(`Error updating company by ID: ${id}, ${error.message}`);
      }
    },
    getCompanyDetails:async(id)=>{
      try {
        const company=await Company.findById({_id:id})
        if (company) {
          logger.info(`Company details retrieved: ${id}`);
        } else {
          logger.warn(`Company not found: ${id}`);
        }
        return company
      } catch (error) {
        logger.error(`Error retrieving company details by ID: ${id}, error: ${error.message}`);
      }
    },
    countRecruiters:async()=>{
      try {
        const recruiters=await Recruiter.countDocuments()
        logger.info(`Total recruiters count: ${recruiters}`);
        return recruiters
      } catch (error) {
        logger.error(`Error counting recruiters: ${error.message}`);
      }
    },
    countCandidates:async()=>{
      try {
        const candidates=await User.countDocuments()
        logger.info(`Total candidates count: ${candidates}`);
        return candidates
      } catch (error) {
      logger.error(`Error counting candidates: ${error.message}`);
      }
    },
    countJobs:async()=>{
      try {
        const jobs=await Job.countDocuments()
        logger.info(`Total jobs count: ${jobs}`);
        return jobs
      } catch (error) {
        logger.error(`Error counting jobs: ${error.message}`);
      }
    },
    getCategoryStats:async()=>{
      try {
        const categories = await Category.aggregate([
          {
            $group: {
              _id: "$categoryName",  
              count: { $sum: 1 }     
            }
          }
        ]);
    
        logger.info(`Category stats retrieved successfully`);
        return categories.map((cat) => ({
          name: cat._id,  
          count: cat.count, 
        }));
      } catch (error) {
        logger.error(`Error fetching category stats: ${error.message}`);
      }
    }
}
export default adminRepository