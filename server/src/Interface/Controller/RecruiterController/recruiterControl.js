import recruiterUseCase from "../../../Application/Usecase/recruiterUsecase.js";
import logger from "../../../Framework/Utilis/logger.js";

const recruiterController = {

    postRecruiterSignup: async (req, res) => {
        try {
            const {recruitername,email,password,companyName}=req.body
            const recruiterData = { recruitername, email, password,companyName }
            const result = await recruiterUseCase.recruiterSignUp(recruiterData)
            if (result.message) {
                logger.warn(`Signup failed for email: ${email}, message: ${result.message}`);
                res.status(409).json({ success: false, message: result.message })
            } else {
                logger.info(`Recruiter registered successfully: ${email}`);
                res.status(201).json({ success: true, message: "Recruiter registered,OTP sent to mail" })
            }
        } catch (error) {
            logger.error(`Error in postRecruiterSignup: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })
        }
    },
    postVerifyOtp: async (req, res) => {
        const { email, otp } = req.body
        try {
            const isVerified = await recruiterUseCase.recruiterVerifyOtp(email, otp)
            if (isVerified) {
                logger.info(`OTP verified successfully for email: ${email}`);
                res.status(200).json({ success: true, message: "OTP verified, recruiter registered successfully" })
            } else {
                logger.warn(`OTP verification failed for email: ${email}`);
                res.status(400).json({ success: false, message: "Enter valid OTP" })
            }
        } catch (error) {
            logger.error(`Error in postVerifyOtp: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })
        }
    },
    postResendOtp: async (req, res) => {
        const { email } = req.body
        try {
            const result = await recruiterUseCase.RecruiterResendOtp(email);
            if (result) {
                logger.info(`OTP resent successfully for email: ${email}`);
                res.status(200).json({ success: true, message: 'OTP resent successfully!' });
            } else {
                logger.warn(`Error resending OTP for email: ${email}`);
                res.status(400).json({ success: false, message: 'Error resending OTP. Please try again.' });
            }
        } catch (error) {
            logger.error(`Error in postResendOtp: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })
        }
    },

    postLogin: async (req, res) => {
        try {
            const { email, password } = req.body
            const recruiterData = { email, password }
            const loginResult = await recruiterUseCase.recruiterlogin(recruiterData)
            if (loginResult.message) {
                logger.warn(`Login failed for email: ${email}, message: ${loginResult.message}`);
                res.status(400).json({ success: false, message: loginResult.message })
            } else {
                const { recruiter, token } = loginResult
                if (recruiter.block) {
                    logger.warn(`Blocked recruiter tried to login: ${email}`);
                    res.clearCookie('recruiteraccessToken');
                    return res.status(403).json({ success: false, message: 'Your account has been blocked. Please contact support.' });
                }
                res.cookie('recruiteraccessToken', String(token), { httpOnly: true,secure:true,sameSite:'None', maxAge: 3600000 })
                logger.info(`Recruiter logged in successfully: ${email}`);
                res.status(200).json({ success: true, message: "Recruiter login successfully", recruiter, token })
            }
        } catch (error) {
            logger.error(`Error in postLogin: ${error.message}`);
            res.status(500).send({ message: "Internal server error" })
        }
    },
    postForgotPassword: async (req, res) => {
        try {
            const { email } = req.body
            const result = await recruiterUseCase.forgotPassword(email)
            if (result.message == "Recruiter not found") {
                logger.warn(`Forgot password attempt for non-existent email: ${email}`);
                res.status(400).json({ success: false, message: result.message })
            }
            if (result.message == "Check our email for reset password link") {
                logger.info(`Reset password link sent to email: ${email}`);
                res.status(200).json({ success: true, message: result.message })
            }
        } catch (error) {
            logger.error(`Error in postForgotPassword: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })
        }
    },
    postResetPassword: async (req, res) => {
        try {
            const { token } = req.params
            const formData = req.body
            const {password}=formData
            const result = await recruiterUseCase.resetPassword(token, password)
            if (result.message == "Recruiter not found, so password doesn't change") {
                logger.warn(`Reset password attempt failed, recruiter not found`);
                res.status(400).json({ success: false, message: result.message })
            } if (result.message == "Password successfully changed") {
                logger.info(`Password successfully changed for token: ${token}`);
                res.status(200).json({ success: true, message: result.message })
            }
        } catch (error) {
            logger.error(`Error in postResetPassword: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })
        }
    },
    recruiterVerified: async (req, res) => {
        try {
            logger.info(`Recruiter verified: ${req.recruiter.email}`);
            res.status(200).json({ success: true, message: "Recruiter verified",recruiter:req.recruiter})
        } catch (error) {
            logger.error(`Error in recruiterVerified: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })
        }
    },
    postLogout: async (req, res) => {
        try {
            res.clearCookie('recruiteraccessToken')
            logger.info(`Recruiter successfully logout: ${req.recruiter.email}`)
            res.status(200).json({ success: true, message: "Recruiter logout successfully" })
        } catch (error) {
            logger.error(`Error in postLogout: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })
        }
    },
    getRecruiterDetails:async(req,res)=>{
        try {
            const {email}=req.params
            const recruiter=await recruiterUseCase.getRecruiterByEmail(email)
            if (recruiter) {
                logger.info(`Fetched recruiter details for email: ${email}, Company: ${recruiter.recruiter.companyName}`);
                res.status(200).json({ success: true,companyName:recruiter.recruiter.companyName });
            } else {
                logger.warn(`No recruiter found for email: ${email}`);
                res.status(404).json({ success: false, message: "Recruiter not found" });
            }
        } catch (error) {
            logger.error(`Error in getRecruiterDetails: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    createOrder:async(req,res)=>{
        const {amount}=req.body
        try {
            const order=await recruiterUseCase.createOrder(amount)
            if(!order){
                logger.warn("Failed to create order.");
                return res.status(400).json({ success: false, message: "Order creation failed." });
            }
            logger.info(`Order created successfully: ${JSON.stringify(order)}`);
            res.status(200).json({ success: true, orderId: order.id });
        } catch (error) {
            logger.error(`Error creating order: ${error.message}`);
            res.status(500).json({ success: false, message: "An error occurred while creating the order" });
        }
    },
    verifyPayment:async(req,res)=>{
        try {
            const { paymentId, orderId, signature, email,amount,planId } = req.body;
            const result=await recruiterUseCase.verifyPayment(paymentId, orderId, signature, email,amount,planId)
            if (result.success) {
                res.status(200).json(result);
              } else {
                res.status(400).json(result);
              }
        } catch (error) {
            logger.error(`Error verifying payment: ${error.message}`);
            res.status(500).json({ success: false, message: "An error occurred while verifying the payment" });
        }
    }
}
export default recruiterController