import logger from "../../../Framework/Utilis/logger.js";
import companyUseCase from "../../../Application/Usecase/companyUsecase.js";

const companyController={
    postCompanySignup:async(req,res)=>{
        try {
            const formData=req.body
            const {companyName,email,password}=formData
            const companyData={companyName,email,password}
            const result =await companyUseCase.companySignup(companyData)
            if(result.message ==="Company name already exists"){
                logger.warn(`Company signup failed: ${result.message}`);
                return res.json({success:false,message:result.message})
            }else if(result.message === "Email already in use"){
                logger.warn(`Company signup failed: ${result.message}`);
                return res.json({success:false,message:result.message})
            }else{
                logger.info('Company registered successfully', { companyName });
                return res.status(201).json({ success: true, message: "Company registered successfully" });
            }
        } catch (error) {
            logger.error(`Error in postCompanySignup controller, ${error.message}`);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },
    postCompanyLogin:async(req,res)=>{
        try {
            const {email,password}=req.body
            const companyData={email,password}
            const loginResult=await companyUseCase.companyLogin(companyData)
            if(loginResult.message){
                logger.warn(`Company login failed: ${loginResult.message}`);
                return res.status(400).json({ success: false, message: loginResult.message });
            }
            const { company, token } = loginResult; 
            res.cookie('companyaccessToken', String(token), { httpOnly: true,secure:true,sameSite:'None', maxAge: 3600000 });
            logger.info(`Company successfully logged in: ${email}`);
            res.status(200).json({ success: true, message: "User login successfully",company, token });
        } catch (error) {
            logger.error(`Error in postCompanyLogin controller, ${error.message}`);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },
    companyVerify:async(req,res)=>{
        try {
           logger.info(`Company verified: ${req.company.email}`);           
           res.status(200).json({ success: true, message: "Company verified",company:req.company})
        } catch (error) {
            logger.error(`Error in company Verified: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })
        }
    },
    getCompanies:async(req,res)=>{
        try {
            const companies=await companyUseCase.getAllCompanies()
            logger.info('Successfully fetched company names');
            return res.status(200).json({ success: true, companyNames:companies });
        } catch (error) {
            logger.error(`Error in getCompanies controller: ${error.message}`);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },
    logOut:async(req,res)=>{
        try {
            res.clearCookie('companyaccessToken');
            logger.info(`Company successfully logged out}`);
            res.status(200).json({ success: true, message: "Company logout successfully" });
        } catch (error) {
            logger.error(`Logout error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    updateProfile:async(req,res)=>{
        try {
           const {updatedCompanyContact}=req.body
           const {email}=req.params
           const updateCompany=await companyUseCase.updateProfile(email,updatedCompanyContact)
           if (updateCompany.message === "Company not found") {
            logger.warn(`Update company failed for email: ${email}, reason: ${updateCompany.message}`);
            res.status(400).json({ success: false, message: updateCompany.message });
        } else if (updateCompany.message === "Company contact details updated successfully") {
            logger.info(`Company contact details updated successfully: ${email}`);
            res.status(200).json({ success: true, message: updateCompany.message, company: updateCompany.result});
        } else {
            logger.warn(`Update user failed for email: ${email}, reason: ${updateCompany.message}`);
            res.status(400).json({ success: false, message: updateCompany.message });
        }
        } catch (error) {
            logger.error(`Update company error for email: ${email}, error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    updateAboutDetails:async(req,res)=>{
        try {
            const {updatedCompanyAbout}=req.body
            const{email}=req.params
            const updateAboutDetails=await companyUseCase.updateAboutDetails(email,updatedCompanyAbout)
            if(updateAboutDetails.message==="Company not found"){
                logger.warn(`Update company about failed for email: ${email}, reason: ${updateAboutDetails.message}`);
                res.status(400).json({ success: false, message: updateAboutDetails.message }); 
            }else if(updateAboutDetails.message==='Company about details updated successfully'){
                logger.info(`Company about details updated successfully: ${email}`);
                res.status(200).json({ success: true, message: updateAboutDetails.message, company: updateAboutDetails.result});
            }else{
                logger.warn(`Update user about failed for email: ${email}, reason: ${updateAboutDetails.message}`);
                res.status(400).json({ success: false, message: updateAboutDetails.message });
            }
        } catch (error) {
            logger.error(`Update company about error for email: ${email}, error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    uploadCompanyDocuments:async(req,res)=>{
        try {
            const companyId  = req.company._id
            const { docType } = req.body;
            const file = req.file;
            if (!file) {
                logger.warn(`Upload document failed: No file provided`);
                return res.status(400).json({ message: "No file provided" });
            }
            const uploadResult = await companyUseCase.uploadCompanyDocuments(companyId, docType, file);
            if (uploadResult.message === "Company not found") {
                logger.warn(`Upload document failed: Company not found with ID: ${companyId}`);
                return res.status(404).json({ message: "Company not found" });
            }
            logger.info(`Document uploaded successfully for company ID: ${companyId}`);
            return res.status(200).json({ message: "Document uploaded successfully", fileUrl: uploadResult.result.fileUrl });
        } catch (error) {
            logger.error(`Error uploading document: ${error.message}`);
            return res.status(500).json({ message: 'Error uploading document' });
        }
    },
    deleteDocument:async(req,res)=>{
        try {
            const companyId = req.company._id;
            const { docType } = req.query;              
            const deleteResult = await companyUseCase.deleteCompanyDocument(companyId, docType);
            if (deleteResult.message === "Company not found") {
                logger.warn(`Delete document failed: Company not found with ID: ${companyId}`);
                return res.status(404).json({ message: "Company not found" });
            }
            logger.info(`Document ${docType} deleted successfully for company ID: ${companyId}`);
            return res.status(200).json({ message: "Document deleted successfully" });
        } catch (error) {
            logger.error(`Error deleting document: ${error.message}`);
            return res.status(500).json({ message: 'Error deleting document' });
        }
    },
    getCompanyReviews:async(req,res)=>{
        try {
            const id=req.company._id
            const reviews=await companyUseCase.getCompanyReviews(id)
            if (reviews) {
                logger.info(`Successfully fetched reviews for company ID: ${id}`);
                return res.status(200).json({success:true,message:"Successfully fetched reviews",reviews});
            } else {
                logger.warn(`No reviews found for company ID: ${id}`);
                return res.status(404).json({success:false,message:"Reviews not found"});
            }
        } catch (error) {
            logger.error(`Error fetching reviews for company ID: ${id}, error: ${error.message}`);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },
    getStats:async(req,res)=>{
        try {
            let companyName=req.company.companyName
            let stats=await companyUseCase.getCompanyStats(companyName)
            if (stats) {
                logger.info(`Successfully fetched stats for company: ${companyName}`);
                return res.status(200).json({ success: true, stats });
            } else {
                logger.warn(`No stats found for company: ${companyName}`);
                return res.status(404).json({ success: false, message: "Stats not found" });
            }
        } catch (error) {
            logger.error(`Error fetching stats for company: ${req.company.companyName}, error: ${error.message}`);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },
    uploadLogo:async(req,res)=>{
        try {
            const companyId=req.company._id
            const file=req.file
            console.log(file,"FILE");
            
            if (!file) {
                logger.warn(`Upload logo failed: No file provided`);
                return res.status(400).json({ success:false,message: "No file provided" });
            }
            const logoUrl=await companyUseCase.uploadLogo(companyId,file)
            if (!logoUrl) {
                logger.warn(`Upload logo failed: Company not found with ID: ${companyId}`);
                return res.status(404).json({ success:false,message: "Company not found" });
            }
            logger.info(`Logo uploaded successfully for company ID: ${companyId}`);
            return res.status(200).json({success:true, message: "Logo uploaded successfully", logoUrl });
        } catch (error) {
            logger.error(`Error uploading logo: ${error.message}`);
            return res.status(500).json({success:false, message: 'Error uploading logo' });
        }
    },
    getRecruiters:async(req,res)=>{
        try {
            const page=parseInt(req.query.page) || 1
          const limit=parseInt(req.query.limit) || 10
          const companyName=req.company.companyName
          const recruiters =await companyUseCase.getRecruiters(companyName,page,limit)
          if(recruiters.message){
            logger.warn(`Error fetching recruiters: ${recruiters.message}`)
          }
          logger.info(`Found ${recruiters.recruiters.length} recruiters`);
          res.status(200).json({ success:true, recruiters:recruiters.recruiters,total:recruiters.total,page:recruiters.page,limit:recruiters.limit })
        } catch (error) {
            logger.error(`Error fetching recruiters: ${error.message}`)
            res.status(500).json({ message: "Internal server error" })
        }
    },
    deleteRecruiter:async(req,res)=>{
        try {
           const {id}=req.params
           const result=await companyUseCase.deleteRecruiter(id) 
           if (result.message === "Recruiter not found") {
            logger.warn(`Failed to delete recruiter: ${result.message} for ID: ${id}`);
            return res.status(404).json({ success: false, message: result.message });
        }
        logger.info(`Recruiter successfully deleted with ID: ${id}`);
        return res.status(200).json({ success: true, message: "Recruiter successfully deleted" });
        } catch (error) {
            logger.error(`Error deleting recruiter with ID: ${req.params.id}, error: ${error.message}`);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}
export default companyController