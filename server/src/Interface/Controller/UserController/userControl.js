import userUseCase from "../../../Application/Usecase/userUsecase.js";
import companyUseCase from "../../../Application/Usecase/companyUsecase.js";
import { generateJWT } from "../../../Framework/Services/jwtServices.js";
import { generateRefreshToken } from "../../../Framework/Services/jwtServices.js";
import logger from "../../../Framework/Utilis/logger.js";

const userController = {

    // create new user
    postSignup: async (req, res) => {
        try {
            const formData = req.body;
            const{username,email,password}=formData
            const userData = { username, email, password };
            let result = await userUseCase.userSignUp(userData);
            if (result.message) {
                logger.warn(`Sign up failed for email: ${email}, reason: ${result.message}`);
                res.status(409).json({ success: false, message: result.message });
            } else {
                logger.info(`User registered: ${email}`);
                res.status(201).json({ success: true, message: "User registered, OTP sent to mail" });
            }
        } catch (error) {
            logger.error(`Signup error for email, error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // Otp verification
    postVerifyOtp: async (req, res) => {
        const { email, otp } = req.body;
        try {
            const isVerified = await userUseCase.verifyOtp(email, otp);
            if (isVerified) {
                logger.info(`OTP verified for email: ${email}`);
                res.status(200).json({ success: true, message: "OTP verified, user registered successfully" });
            } else {
                logger.warn(`OTP verification failed for email: ${email}`);
                res.status(400).json({ success: false, message: "Enter valid OTP" });
            }
        } catch (error) {
            logger.error(`OTP verification error for email: ${email}, error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // Resend otp
    postResendOtp: async (req, res) => {
        const { email } = req.body;
        try {
            const result = await userUseCase.resentOtp(email);
            if (result) {
                logger.info(`OTP resend for email: ${email}`);
                res.status(200).json({ success: true, message: 'OTP resent successfully!' });
            } else {
                logger.warn(`Resend OTP failed for email: ${email}`);
                res.status(400).json({ success: false, message: 'Error resending OTP. Please try again.' });
            }
        } catch (error) {
            logger.error(`Resend OTP error for email: ${email}, error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // User login
    postLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const userData = { email, password };
            const loginResult = await userUseCase.userlogin(userData);
            if (loginResult.message) {
                logger.warn(`Login failed for email: ${email}, reason: ${loginResult.message}`);
                return res.status(400).json({ success: false, message: loginResult.message });
            } 
            const { user, token,refreshToken } = loginResult;             
            if(user.block){
                logger.warn(`Blocked user tried to login: ${email}`);
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken')
                return res.status(403).json({ success: false, message: 'Your account has been blocked. Please contact support.' });              
            }
            res.cookie('accessToken', String(token), { httpOnly: true,secure:true,sameSite:'None',maxAge: 3600000 });
            res.cookie('refreshToken', refreshToken, { httpOnly: true,secure:true,sameSite:'None', maxAge: 7 * 24 * 60 * 60 * 1000 });
            logger.info(`User successfully logged in: ${email}`);
            res.status(200).json({ success: true, message: "User login successfully", user, token });
        } catch (error) {
            logger.error(`Login error, error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // Forgot password
    postForgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const result = await userUseCase.forgotPassword(email);
            if (result.message === "User not found") {
                logger.warn(`Forgot password failed for email: ${email}, reason: ${result.message}`);
                res.status(400).json({ success: false, message: result.message });
            } else if (result.message === "Check our email for reset password link") {
                logger.info(`Password reset email sent to: ${email}`);
                res.status(200).json({ success: true, message: result.message });
            } else {
                logger.warn(`Forgot password failed for email: ${email}, reason: ${result.message}`);
                res.status(400).json({ success: false, message: result.message });
            }
        } catch (error) {
            logger.error(`Forgot password error for email: ${email}, error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // Reset password
    postResetPassword: async (req, res) => {
        try {
            const { token } = req.params
            const formData = req.body
            const {password}=formData
            const result = await userUseCase.resetPassword(token, password);
            if (result.message === "User not found, so password doesn't change") {
                logger.warn(`Reset password failed, user not found for token: ${token}`);
                res.status(400).json({ success: false, message: result.message });
            } else if (result.message === "Password successfully changed") {
                logger.info(`Password successfully changed for token: ${token}`);
                res.status(200).json({ success: true, message: result.message });
            } else {
                logger.warn(`Reset password failed for token: ${token}, reason: ${result.message}`);
                res.status(400).json({ success: false, message: result.message });
            }
        } catch (error) {
            logger.error(`Reset password error for token: ${token}, error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // User verification
    isVerified: async (req, res) => {
        try {
            logger.info(`User verified: ${req.user.user.email}`);            
            res.status(200).json({ success: true, message: "Verified user", user: req.user });
        } catch (error) {
            logger.error(`Verification error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // Get all users
    getUser: async (req, res) => {
        try {
            const { email } = req.params;
            const result = await userUseCase.getUserByEmail(email);
            if (result.message) {
                logger.warn(`User not found for email: ${email}`);
                res.status(400).json({ success: false, message: result.message });
            } else {
                const { user } = result;
                logger.info(`User found: ${email}`);
                res.status(200).json({ success: true, message: "User found successfully", user });
            }
        } catch (error) {
            logger.error(`Get user error for email: ${email}, error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // Update user details
    userUpdate: async (req, res) => {
        try {
            const email = req.user.user.email;
            const { updatedUserContact } = req.body;
            const updatedUser = await userUseCase.updateUser(email, updatedUserContact);
            if (updatedUser.message === "User not found") {
                logger.warn(`Update user failed for email: ${email}, reason: ${updatedUser.message}`);
                res.status(400).json({ success: false, message: updatedUser.message });
            } else if (updatedUser.message === "User contact details updated successfully") {
                logger.info(`User details updated successfully: ${email}`);
                res.status(200).json({ success: true, message: updatedUser.message, user: updatedUser.user });
            } else {
                logger.warn(`Update user failed for email: ${email}, reason: ${updatedUser.message}`);
                res.status(400).json({ success: false, message: updatedUser.message });
            }
        } catch (error) {
            logger.error(`Update user error for email: ${email}, error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // Add user education
    addEducation: async (req, res) => {
        try {
            const { email } = req.params;
            const { education } = req.body;
            const insertEducation = await userUseCase.addEducation(email, education);
            if (insertEducation.message === "User not found") {
                logger.warn(`Add education failed for email: ${email}, reason: ${insertEducation.message}`);
                res.status(400).json({ success: false, message: insertEducation.message });
            } else if (insertEducation.message === "User education added successfully") {
                logger.info(`Education details successfully added: ${email}`);
                res.status(200).json({ success: true, message: insertEducation.message, user: insertEducation.user });
            } else {
                logger.warn(`Add education failed for email: ${email}, reason: ${insertEducation.message}`);
                res.status(400).json({ success: false, message: insertEducation.message });
            }
        } catch (error) {
            logger.error(`Add education failed for email: ${email}, error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    editEducation:async(req,res)=>{
        try {
            const {id}=req.params
            const email=req.user.user.email
            const {education}=req.body
            const updatedEducation=await userUseCase.editEducation(email,id,education)
        if (updatedEducation.message==="User or education not found") {
            logger.warn(`Edit education failed for email: ${email}, reason: User or education not found`);
            res.status(400).json({ success: false, message: "User or education not found" });
        } else if(updatedEducation.message==="User education updated successfully") {
            logger.info(`User education updated successfully for email: ${email}, education ID: ${id}`);
            res.status(200).json({ success: true, message: "User education updated successfully", user: updatedEducation.user });
        }else{
            logger.warn(`Edit education failed for email: ${email}, reason: ${updatedEducation.message}`);
                res.status(400).json({ success: false, message:updatedEducation.message });
        }
        } catch (error) {
            logger.error(`Edit education failed for email: ${email}, education ID: ${id}, error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    deleteEducation:async(req,res)=>{
        try {
            const {id}=req.params
            const email=req.user.user.email
            const updatedEducation=await userUseCase.deleteEducation(id,email)
            if (updatedEducation.message === "Education removed successfully") {
                logger.info(`Successfully deleted education with ID '${id}' for user with email: ${email}`);
                res.status(200).json({ success: true, message: updatedEducation.message, user: updatedEducation.user });
            } else {
                logger.warn(`Failed to delete education with ID '${id}' for user with email: ${email}, reason: ${updatedEducation.message}`);
                res.status(400).json({ success: false, message: updatedEducation.message });
            }
        } catch (error) {
            logger.error(`Error deleting education with ID '${id}' for user with email: ${email}, error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    // Add user skills
    addSkill: async (req, res) => {
        try {
            const { email } = req.params;
            const { skill } = req.body;
            const insertSkill = await userUseCase.addSkill(email, skill);
            if (insertSkill.message === "User not found") {
                logger.warn(`Add skill failed for email: ${email}, reason: ${insertSkill.message}`);
                res.status(400).json({ success: false, message: insertSkill.message });
            } else if (insertSkill.message === "User skill added successfully") {
                logger.info(`Skill details successfully added: ${email}`);
                res.status(200).json({ success: true, message: insertSkill.message, user: insertSkill.user });
            } else {
                logger.warn(`Add skill failed for email: ${email}, reason: ${insertSkill.message}`);
                res.status(400).json({ success: false, message: insertSkill.message });
            }
        } catch (error) {
            logger.error(`Add skill failed for email: ${email}, error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    editSkill:async(req,res)=>{
        try {
            const{email}=req.params
            const {oldSkill,newSkill}=req.body
            const result=await userUseCase.editSkill(email,oldSkill,newSkill)
            if (result.message === "Skill not found or update failed") {
                logger.warn(`Edit skill failed for email: ${email}, reason: ${result.message}`);
                return res.status(400).json({ success: false, message: result.message });
              }
                if (result.message === "User skill updated successfully") {
                logger.info(`Skill "${oldSkill}" successfully updated to "${newSkill}" for email: ${email}`);
                return res.status(200).json({ success: true, message: result.message, user: result.updatedUser });
              }
              logger.warn(`Edit skill failed for email: ${email}, reason: ${result.message}`);
              return res.status(400).json({ success: false, message: result.message });
        } catch (error) {
            logger.error(`Edit skill failed for email: ${email}, error: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    deleteSkill:async(req,res)=>{
        try {
            const email=req.user.user.email
            const skill=req.params.skill
            const updatedUser=await userUseCase.deleteSkill(email,skill)
            if(updatedUser.message=="Skill removed successfully"){
                logger.info(`Successfully deleted skill '${skill}' for user with email: ${email}`);
                res.status(200).json({ success: true, message: updatedUser.message,user:updatedUser.user});
            }else {
                logger.warn(`Failed to delete skill '${skill}' for user with email: ${email}, reason: ${updateUser.message}`);
                res.status(400).json({ success: false, message: updatedUser.message});
            }
        } catch (error) {
            logger.error(`Error deleting skill '${req.params.skill}' for user with email: ${req.user.user.email}, error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    addDescription:async(req,res)=>{
        try {
            const {userId,description}=req.body
            const result=await userUseCase.addDescription(userId,description)
            if(result.message){
                logger.warn(`Failed to add description for user ID: ${userId}, reason: ${result.message}`);
                res.status(400).json({ success: false, message: result.message });
            }else{
                logger.info(`Description added successfully for user ID: ${userId}`);
                res.status(200).json({ success: true, message:"Description added successfully",description:result});
            }
        } catch (error) {
            logger.error(`Add description error for user ID: ${userId}, error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }

    },
    getDescription:async(req,res)=>{
        try {
            const {id}=req.params
            const result=await userUseCase.getDescription(id)
            if(result.message){
                logger.warn(`No description found for user with ID: ${id}`);
                return res.status(404).json({ success:false,message: result.message });
            }else{
                logger.info(`Description found for user with ID: ${id}`);
                return res.status(200).json({success:true,message:"Description found succcessfully",result});
            }
        } catch (error) {
            logger.error(`Error fetching description for user with ID: ${id}`, error);
        return res.status(500).json({ message: 'Error fetching description' });
        }
    },

    addWorkExperience:async(req,res)=>{
        try {
            const data={...req.body,userId:req.user.user._id}
            const result=await userUseCase.addWorkExperience(data)
            logger.info(`Work experience added successfully for user ID: ${data.userId}, experience ID: ${result._id}`);
            res.status(201).json({ success: true, message: 'Work experience added successfully.', data: result });
        } catch (error) {
            logger.error(`Failed to add work experience for user ID: ${req.user.user._id}. Error: ${error.message}`);
            res.status(500).json({ success: false, message: 'Failed to add work experience.', error: error.message });
        }
    },
    editWorkExperience:async(req,res)=>{
        try {
            const data={...req.body,userId:req.user.user.id,experienceId:req.params.id}
            const result = await userUseCase.editWorkExperience(data);
            if (!result) {
                logger.warn(`Work experience not found for experience ID: ${req.params.id}, user ID: ${data.userId}`);
                return res.status(404).json({ success: false, message: 'Work experience not found.' });
            }
            logger.info(`Work experience updated successfully for experience ID: ${req.params.id}, user ID: ${data.userId}`);
            res.status(200).json({ success: true, message: 'Work experience updated successfully.', data: result });
        } catch (error) {
            logger.error(`Error updating work experience for experience ID: ${req.params.id}, user ID: ${req.user.user.id}. Error: ${error.message}`);
            res.status(500).json({ success: false, message: 'Failed to update work experience.', error: error.message });
        }
    },
    deleteWorkExperience:async(req,res)=>{
        try {
            let userId=req.user.user._id
            let {experienceId}=req.params
           const experiences=await userUseCase.deleteWorkExperience(userId,experienceId)
           if (experiences) {
            logger.info('Successfully deleted work experience for user ID: ' + userId + ', experience ID: ' + experienceId);
            return res.status(200).json({ success: true, message: 'Work experience deleted successfully',experiences });
        } else {
            logger.warn('No work experience found to delete for experience ID: ' + experienceId);
            return res.status(404).json({ success: false, message: 'Work experience not found' });
        }  
        } catch (error) {
            logger.error('Error deleting work experience for user ID: ' + userId + ', experience ID: ' + experienceId + '. Error: ' + error.message);
            return res.status(500).json({ success: false, message: 'An error occurred while deleting work experience' });
        }

    },
    getWorkExperience:async(req,res)=>{
        try {
            const userId=req.user.user._id
            const experiences=await userUseCase.getExperiences(userId)
            logger.info(`Successfully retrieved work experiences for user ${userId}`);
            res.status(200).json({ success: true, experiences });
        } catch (error) {
            logger.error(`Error retrieving work experiences for user ${userId}: ${error.message}`);
            res.status(500).json({ success: false, message: 'Failed to retrieve work experiences' });
        }
    },
    addResume:async(req,res)=>{
        try {
            if(!req.file){
                logger.warn('No file uploaded');
                return res.status(400).json({ success: false, message: 'No file uploaded' });
            }
            const userId=req.user.user._id
            const resumeUrl=await userUseCase.addResumeUrl(req.file,userId)
            logger.info(`Resume uploaded successfully for user ${userId}`);
            return res.status(200).json({success:true,message:"Add resume successfully",resumeUrl})
        } catch (error) {
            logger.error(`Error uploading resume for user ${req.user.user._id}: ${error.message}`);
            res.status(500).json({ success: false, message: 'Failed to upload resume' });
        }
    },
    deleteResume:async(req,res)=>{
        try {
            const id=req.user.user._id
            const resume=await userUseCase.deleteResume(id)
            if (resume) {
                logger.info(`Successfully removed resume for user ${id}.`);
                res.status(200).json({ success: true, message: 'Resume deleted successfully' });
            } else {
                logger.warn(`No resume found for user ${id}.`);
                res.json({ success: false, message: 'No resume found to delete' });
            }
        } catch (error) {
            logger.error(`Error removing resume for user ${id}: ${error.message}`);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    getResumeUrl:async(req,res)=>{
        try {
            const userId=req.user.user._id
            const resumeUrl = await userUseCase.getResumeUrl(userId);

            if (resumeUrl) {
                logger.info(`Successfully retrieved resume URL for user ${userId}. Resume URL: ${resumeUrl}`);
                res.status(200).json({ success: true, resumeUrl });
            } else {
                logger.warn(`No resume URL found for user ${userId}.`);
                res.status(404).json({ success: false, message: 'Resume URL not found' });
            }
        } catch (error) {
            logger.error(`Error retrieving resume URL for user ${userId}: ${error.message}`);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    getCompanies:async(req,res)=>{
        try {
            const result=await companyUseCase.getCompanies()
            if (result.message) {
                logger.warn(`Failed to fetch companies, reason: ${result.message}`);
                return res.status(404).json({ success: false, message: result.message });
            } else {
                logger.info(`Companies retrieved successfully`);
                return res.status(200).json({ success: true, companies: result });
            }
        } catch (error) {
            logger.error(`Error fetching companies: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    getCompanyDetails:async(req,res)=>{
        try {
            const {id}=req.params
            const company=await companyUseCase.getCompanyDetails(id)
            if (company) {
                logger.info(`Successfully retrieved company details for ID: ${id}`);
                res.status(200).json({ success: true, company });
            } else {
                logger.warn(`Company not found for ID: ${id}`);
                res.status(404).json({ success: false, message: 'Company not found' });
            }
        } catch (error) {
            logger.error(`Error retrieving company details for ID: ${id}: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },


    // Google authentication
    handlePassport: async (req, res) => {
        if (req.user) {
          try {
            const googleUser = await userUseCase.findOrCreateGoogleUser(req.user);
            const token = await generateJWT(googleUser.email);
            res.cookie('accessToken', String(token), { httpOnly: false, maxAge: 3600000 });
            const redirectUrl = `https://workstation.today/auth?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(googleUser))}`;
            res.redirect(redirectUrl);
          } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
          }
        } else {
          res.status(401).json({ success: false, message: "Google authentication failed" });
        }
      },
      

    // User logout
    postLogout: async (req, res) => {
        try {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            logger.info(`User successfully logged out: ${req.user.user.email}`);
            res.status(200).json({ success: true, message: "User logout successfully" });
        } catch (error) {
            logger.error(`Logout error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },

}

export default userController;
