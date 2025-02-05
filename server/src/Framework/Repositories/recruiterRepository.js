import { Recruiter } from "../../Core/Entities/recruiterCollection.js";
import { TemperoryRecruiter } from "../../Core/Entities/temperoryRecruiterCollection.js";
import logger from "../Utilis/logger.js";

const recruiterRepository = {
    createRecruiter: async (recruiterData) => {
        try {
            const newRecruiter = new TemperoryRecruiter(recruiterData)
            await newRecruiter.save()
            logger.info(`Created new temporary recruiter: ${newRecruiter.email}`);
            return newRecruiter
        } catch (error) {
            logger.error(`Error creating recruiter: ${error}`);
        }
    },

    findRecruiterByEmail: async (email) => {
        try {
            const recruiter = await Recruiter.findOne({ email: email })
            logger.info(`Found recruiter by email: ${email}`);
            return recruiter
        } catch (error) {
            logger.error(`Error finding recruiter by email: ${error}`);
        }
    },
    findRecruiterByIdAndUpdate: async (id, value) => {
        try {
            const updatedRecruiter = await Recruiter.findByIdAndUpdate({ _id: id }, { password: value })
            logger.info(`Updated recruiter password for ID: ${id}`);
            return updatedRecruiter
        } catch (error) {
            logger.error(`Error updating recruiter password for ID: ${id}, error: ${error}`);
        }
    },
    findTemperoryRecruiterByEmail: async (email) => {
        try {
            const tempRecruiter = await TemperoryRecruiter.findOne({ email: email })
            logger.info(`Found temporary recruiter by email: ${email}`);
            return tempRecruiter
        } catch (error) {
            logger.error(`Error finding temporary recruiter by email: ${error}`);
        }
    },
    updateRecruiterOtp: async (email, otp, expiration) => {
        try {
            const updatedRecruiter = TemperoryRecruiter.findOneAndUpdate({ email: email }, { $set: { otpCode: otp, otpExpiration: expiration } }, { new: true })
            logger.info(`Updated OTP for temporary recruiter with email: ${email}`);
            return updatedRecruiter
        } catch (error) {
            logger.error(`Error updating OTP for temporary recruiter with email: ${error}`);
        }
    },
    moveTemperoryRecruiterToRecruiter: async (email) => {
        try {
            const tempRecruiter = await TemperoryRecruiter.findOne({ email: email })
            if (tempRecruiter) {
                const permanentRecruiter = new Recruiter({
                    recruitername: tempRecruiter.recruitername,
                    email: tempRecruiter.email,
                    password: tempRecruiter.password,
                    companyName:tempRecruiter.companyName
                })
                await permanentRecruiter.save()
                await TemperoryRecruiter.deleteOne({ email: email })
                logger.info(`Moved temporary recruiter to permanent recruiter: ${email}`);
                return permanentRecruiter
            } else {
                logger.warn(`Temporary recruiter not found with email: ${email}`);
            }
        } catch (error) {
            logger.error(`Error moving temporary recruiter to permanent recruiter: ${error}`);
        }
    },
    updateRecruiterSubscription:async(email,isSubscribed)=>{
        try {
            const result=await Recruiter.findOneAndUpdate({email:email},{isSubscribed},{new:true})
            if (!result) {
                logger.warn(`Recruiter with email ${email} not found.`);
              } else {
                logger.info(`Recruiter subscription updated: ${email}`);
              }
              return result;
        } catch (error) {
            logger.error(`Failed to update recruiter subscription. Error: ${error.message}`, { error });
        }
    }
}

export default recruiterRepository