import recruiterRepository from "../../Framework/Repositories/recruiterRepository.js";
import generateOTP from "../../Framework/Services/otpServices.js";
import EmailService from "../../Framework/Services/mailerServices.js";
import { generateJWT } from "../../Framework/Services/jwtServices.js";
import sendRecruiterEmail from "../../Framework/Services/recruiterForgotPassword.js";
import paymentService from "../../Framework/Services/razorpayServices.js";
import logger from "../../Framework/Utilis/logger.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import orderRepository from "../../Framework/Repositories/orderRepository.js";
dotenv.config()

const emailService = new EmailService()

const recruiterUseCase = {

    recruiterSignUp: async (recruiterData) => {
        try {
            const { recruitername, email, password,companyName } = recruiterData
            const existingRecruiter = await recruiterRepository.findRecruiterByEmail(email)
            if (existingRecruiter) {
                logger.warn(`Recruiter already registered: ${email}`);
                return { message: "Recruiter already registered" }
            }
            const hashPassword = await bcrypt.hash(password, 10)
            const otp = generateOTP()
            const expiration = new Date(Date.now() + 5 * 60 * 1000);
            const newRecruiter = await recruiterRepository.createRecruiter({
                recruitername: recruitername,
                email: email,
                password: hashPassword,
                companyName:companyName,
                otpCode: otp,
                otpExpiration: expiration
            })
            await emailService.sendOtpEmail(email, otp)
            logger.info(`New recruiter created: ${email}`);
            return newRecruiter
        } catch (error) {
            logger.error(`Error in recruiterSignUp: ${error}`);
        }
    },



    recruiterVerifyOtp: async (email, otp) => {
        try {
            const recruiter = await recruiterRepository.findTemperoryRecruiterByEmail(email)
            if (!recruiter) {
                logger.warn(`Temporary recruiter not found: ${email}`);
                return { message: "Temperory recruiter not found" }
            }
            if (recruiter.otpCode == otp && recruiter.otpExpiration > Date.now()) {
                await recruiterRepository.moveTemperoryRecruiterToRecruiter(email)
                logger.info(`Recruiter verified and moved to permanent: ${email}`);
                return true
            } else {
                logger.warn(`Invalid or expired OTP for recruiter: ${email}`);
                return { message: "Invalid or Expired OTP" }
            }
        } catch (error) {
            logger.error(`Error in recruiterVerifyOtp: ${error}`);
        }
    },

    RecruiterResendOtp: async (email) => {
        try {
            const otp = generateOTP()
            const expiration = new Date(Date.now() + 5 * 60 * 1000);
            await recruiterRepository.updateRecruiterOtp(email, otp, expiration)
            await emailService.sendOtpEmail(email, otp)
            logger.info(`Resent OTP to recruiter: ${email}`);
            return true
        } catch (error) {
            logger.error(`Error in RecruiterResendOtp: ${error}`);
        }
    },



    recruiterlogin: async (recruiterData) => {
        try {
            const { email, password } = recruiterData
            const recruiter = await recruiterRepository.findRecruiterByEmail(email)
            if (!recruiter) {
                logger.warn(`Recruiter not found: ${email}`);
                return { message: "Recruiter not found" }
            }
            const valid = await bcrypt.compare(password, recruiter.password)
            if (!valid) {
                logger.warn(`Incorrect password for recruiter: ${email}`);
                return { message: "Incorrect password" }
            }
            const token = await generateJWT(recruiter.email,recruiter.role)
            logger.info(`Recruiter logged in: ${email}`);
            return { recruiter, token }
        } catch (error) {
            logger.error(`Error in recruiterlogin: ${error}`);
            return { message: error.message }
        }
    },



    forgotPassword: async (email) => {
        try {
            const recruiter = await recruiterRepository.findRecruiterByEmail(email)
            if (!recruiter) {
                logger.warn(`Recruiter not found: ${email}`);
                return { message: "Recruiter not found" }
            }
            const token = jwt.sign({ id: recruiter._id }, process.env.KEY, { expiresIn: '1h' });
            sendRecruiterEmail(token, recruiter.email)
            logger.info(`Sent forgot password email to recruiter: ${email}`);
            return { message: "Check our email for reset password link" }
        } catch (error) {
            logger.error(`Error in forgotPassword: ${error}`);
        }
    },


    resetPassword: async (token, password) => {
        try {
            const decoded = jwt.verify(token, process.env.KEY)
            const id = decoded.id
            const hashPassword = await bcrypt.hash(password, 10)
            const recruiter = await recruiterRepository.findRecruiterByIdAndUpdate(id, hashPassword)
            if (!recruiter) {
                logger.warn(`Recruiter not found for reset password: ${id}`);
                return { message: "Recruiter not found, so password doesn't change" }
            } else {
                logger.info(`Password successfully changed for recruiter: ${id}`);
                return { message: "Password successfully changed" }
            }
        } catch (error) {
            logger.error(`Error in resetPassword: ${error}`);
        }
    },
    getRecruiterByEmail: async (email) => {
        try {
            const recruiter = await recruiterRepository.findRecruiterByEmail(email)
            if (!recruiter) {
                logger.warn(`Recruiter not found: ${email}`);
                return { message: "Recruiter not found" }
            } else {
                return { recruiter }
            }
        } catch (error) {
            logger.error(`Error in getRecruiterByEmail: ${error}`);
        }
    },
    createOrder:async(amount)=>{
        try {
            const order=await paymentService.createOrder(amount)
            return order
        } catch (error) {
            logger.error(`Failed to create order. Error: ${error.message}`, { error });
        }
    },
    verifyPayment:async(paymentId,orderId,signature,email,amount,planId)=>{
        try {
            const verification=await paymentService.verifyPayment(paymentId, orderId, signature)
            if(!verification.success){
                logger.warn(`Invalid signature for payment ID: ${paymentId}`);
                return { success: false, message: 'Invalid signature' };
            }
                const subscriptionUpdated= await recruiterRepository.updateRecruiterSubscription(email,true)
                if(!subscriptionUpdated){
                    logger.warn(`Failed to update subscription for email: ${email}`);
                    return { success: false, message: 'Failed to update subscription' };
                }
                logger.info(`Payment verified successfully for email: ${email}`);
                const recruiter=await recruiterRepository.findRecruiterByEmail(email)
                if (!recruiter) {
                    logger.warn(`Recruiter with email ${email} not found.`);
                    return { success: false, message: 'Recruiter not found' };
                }
                const order = {
                    userId: recruiter._id, 
                    planId: planId,
                    amount: amount,
                    orderDate: new Date()   
                };
                const savedOrder=await orderRepository.createNewOrder(order)
                if (!savedOrder) {
                    logger.warn(`Failed to create order for recruiter ${email}`);
                    return { success: false, message: 'Failed to create order' };
                }
                logger.info(`Order created for recruiter ${email} with order ID: ${savedOrder._id}`);
                return { success: true, message: 'Payment verified, subscription updated, and order created' };
        } catch (error) {
            logger.error(`Failed to verify payment. Error: ${error.message}`, { error });
        }
    }
}

export default recruiterUseCase