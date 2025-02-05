
import { User } from "../../Core/Entities/userCollection.js";
import { TemperoryUser } from "../../Core/Entities/temperoryUserCollection.js";
import { JobExperience } from "../../Core/Entities/jobExperienceCollection.js";
import logger from "../Utilis/logger.js";

const userRepository = {

    // Create temperory user
    createTemperoryUser: async (userData) => {
        try {
            const newUser = new TemperoryUser(userData)
            await newUser.save()
            logger.info(`Temperory user created: ${userData.email}`);
            return newUser
        } catch (error) {
            logger.error(`Error during temperory user creation: ${error.message}`);
        }
    },

    // Find user by email
    findUserByEmail: async (email) => {
        try {
            let user = await User.findOne({ email: email })
            logger.info(`User found by email: ${email}`);
            return user
        } catch (error) {
            logger.error(`Error during finding user by email: ${email}, error: ${error.message}`);
        }
    },

    // Find temperory user by email
    findTemperoryUserByEmail: async (email) => {
        try {
            let temperoryUser = await TemperoryUser.findOne({ email: email })
            logger.info(`Temperory user found by email: ${email}`);
            return temperoryUser
        } catch (error) {
            logger.error(`Error during finding temperory user by email: ${email}, error: ${error.message}`);
        }
    },

    // Update user contact details
    updateContact: async (email, updatedUserContact) => {
        try {
            const user = await User.findOneAndUpdate({ email: email }, updatedUserContact, { new: true })
            logger.info(`User contact updated for email: ${email}`);
            return user
        } catch (error) {
            logger.error(`Error during updating user contact for email: ${email}, error: ${error.message}`);
        }
    },

    // Add education details of user
    addEducation: async (email, education) => {
        try {
            let user = await User.findOneAndUpdate({ email: email }, { $push: { 'Qualification.education': education } }, { new: true })
            logger.info(`Education added for email: ${email}`);
            return user
        } catch (error) {
            logger.error(`Error during adding education for email: ${email}, error: ${error.message}`);
        }
    },
    editEducation: async (email, id, education) => {
        try {
            let user = await User.findOneAndUpdate({ email: email, 'Qualification.education._id': id }, {
                $set: { 'Qualification.education.$': education }
            }, { new: true })
            if (!user) {
                logger.warn(`Edit education failed for email: ${email}, reason: User or education not found`);
                return null;
            }
            logger.info(`Education details successfully updated for email: ${email}, updated education ID: ${id}`);
            return user;
        } catch (error) {
            logger.error(`Error during editing education for email: ${email}, education ID: ${id}, error: ${error.message}`);
        }
    },
    removeEducation: async (id, email) => {
        try {
            const user = await User.findOneAndUpdate({ email: email }, { $pull: { 'Qualification.education': { _id: id } } }, { new: true })
            if (user) {
                logger.info(`Education with ID: ${id} removed for user with email: ${email}`);
            } else {
                logger.warn(`No user found with email: ${email}. Education removal failed.`);
            }
            return user
        } catch (error) {
            logger.error(`Error during removing education with ID: ${id} for user with email: ${email}. Error: ${error.message}`);
        }
    },
    // Add skills of user
    addSkill: async (email, skill) => {
        try {
            let user = await User.findOneAndUpdate({ email: email }, { $push: { 'Qualification.skills': skill } }, { new: true })
            logger.info(`Skill added for email: ${email}`);
            return user
        } catch (error) {
            logger.error(`Error during adding skill for email: ${email}, error: ${error.message}`);
        }
    },
    editSkills: async (email, oldSkill, newSkill) => {
        try {
            const user = await User.findOneAndUpdate({ email: email, 'Qualification.skills': oldSkill },
                { $set: { 'Qualification.skills.$': newSkill } }, { new: true }
            )
            if (!user) {
                logger.error(`User with email: ${email} not found or old skill "${oldSkill}" not present`);
                return null;
            }
            logger.info(`Skill "${oldSkill}" updated to "${newSkill}" for email: ${email}`);
            return user
        } catch (error) {
            logger.error(`Error updating skill for email: ${email}, error: ${error.message}`);
        }
    },
    removeSkill: async (email, skill) => {
        try {
            let user = await User.findOneAndUpdate({ email: email }, { $pull: { 'Qualification.skills': skill } }, { new: true })
            if (user) {
                logger.info(`Skill '${skill}' removed for user with email: ${email}`);
            } else {
                logger.warn(`No user found with email: ${email}. Skill '${skill}' removal failed.`);
            }
            return user
        } catch (error) {
            logger.error(`Error during removing skill '${skill}' for user with email: ${email}. Error: ${error.message}`);
        }
    },
    addDescription: async (id, description) => {
        try {
            let result = await User.findOneAndUpdate({ _id: id }, { description: description }, { new: true })
            if (!result) {
                logger.warn(`Add description failed for user ID: ${id}`);
                return { message: "Failed to add description" };
            } else {
                logger.info(`Description added successfully for user ID: ${id}`);
                return result
            }
        } catch (error) {
            logger.error(`Add description error for user ID: ${id}, error: ${error.message}`)
        }
    },
    getDescription: async (id) => {
        try {
            let result = await User.findById({ _id: id })
            if (result) {
                logger.info(`Description found for user with ID: ${id}`);
                return result.description;
            } else {
                logger.warn(`No user found with ID: ${id}`);
                return null;
            }
        } catch (error) {
            logger.error(`Error fetching description for user with ID: ${id}`, error);
        }
    },

    addWorkExperience: async (data) => {
        try {
            let result = new JobExperience(data)
            await result.save()
            logger.info('Successfully added work experience for user ID: ' + data.userId);
            return result;
        } catch (error) {
            logger.error('Error adding work experience for user ID: ' + data.userId + '. Error: ' + error.message);
        }
    },
    editWorkExperience:async(id,data)=>{
        try {
            const result=await JobExperience.findByIdAndUpdate({_id:id},{$set: data },{new:true})
            if (!result) {
                logger.warn(`Work experience not found for ID: ${id}`);
                return null;
            }
            logger.info(`Work experience updated successfully for experience ID: ${id}`);
            return result;
        } catch (error) {
            logger.error(`Error updating work experience for experience ID: ${id}. Error: ${error.message}`);
        }
    },
    removeWorkExperience: async (id, experienceId) => {
        try {
            let result = await JobExperience.findByIdAndDelete({ _id: experienceId })
            if (result) {
                await User.findByIdAndUpdate({ _id: id }, {
                    $pull: { jobExperienceId: experienceId }
                })
                logger.info('Successfully removed work experience for user ID: ' + id + ', experience ID: ' + experienceId);
            } else {
                logger.warn('No work experience found for experience ID: ' + experienceId);
            }
            return result
        } catch (error) {
            logger.error('Error removing work experience for user ID: ' + id + ', experience ID: ' + experienceId + '. Error: ' + error.message);
        }
    },
    getUserWorkExperience: async (userId) => {
        try {
            const experience = await JobExperience.find({ userId: userId })
            logger.info(`Fetched work experience for user ${userId}`);
            return experience
        } catch (error) {
            logger.error(`Error fetching work experience for user ${userId}: ${error.message}`);
        }
    },
    addJobExperienceToUser: async (userId, jobExperienceId) => {
        try {
            await User.findByIdAndUpdate({ _id: userId }, { $push: { jobExperienceId: jobExperienceId } }, { new: true })
            logger.info('Successfully added job experience ID: ' + jobExperienceId + ' to user ID: ' + userId);
        } catch (error) {
            logger.error('Error adding job experience ID: ' + jobExperienceId + ' to user ID: ' + userId + '. Error: ' + error.message);
        }
    },
    addResumeUrl: async (userId, resumeUrl) => {
        try {
            const result = await User.findOneAndUpdate({ _id: userId }, { resume: resumeUrl }, { new: true })
            if (result) {
                logger.info(`Successfully updated resume URL for user ${userId}. New resume URL: ${resumeUrl}`);
            } else {
                logger.warn(`No user found with ID ${userId}. Resume URL update failed.`);
            }
            return result
        } catch (error) {
            logger.error(`Error updating resume URL for user ${userId}: ${error.message}`);
        }
    },
    removeResume: async (id) => {
        try {
            const user = await User.findById({ _id: id })
            if (!user) {
                logger.warn(`No user found with ID ${id}. Resume removal failed.`);
            }
            user.resume = ''
            const updatedUser = await user.save()
            logger.info(`Successfully removed resume for user ${id}.`);
            return updatedUser
        } catch (error) {
            logger.error(`Error removing resume for user ${id}: ${error.message}`);
        }
    },
    getResumeUrl: async (userId) => {
        try {
            const result = await User.findOne({ _id: userId });
            if (result) {
                return result.resume;
            } else {
                logger.warn(`No user found with ID ${userId}. Unable to retrieve resume URL.`);
            }
        } catch (error) {
            logger.error(`Error retrieving resume URL for user ${userId}: ${error.message}`);
        }
    },


    // Find user by id and update password
    findUserByIdAndUpdate: async (id, value) => {
        try {
            let user = await User.findByIdAndUpdate({ _id: id }, { password: value })
            logger.info(`User password updated for ID: ${id}`);
            return user
        } catch (error) {
            logger.error(`Error during updating user password for ID: ${id}, error: ${error.message}`);
        }
    },

    // Find user by id
    findUserById: async (userId) => {
        try {
            let user = await User.findById({ _id: userId })
            logger.info(`User found by ID: ${userId}`);
            return user
        } catch (error) {
            logger.error(`Error during finding user by ID: ${userId}, error: ${error.message}`);
        }
    },

    // Update otp
    updateUserOtp: async (email, otp, expiration) => {
        try {
            let temperoryUser = await TemperoryUser.findOneAndUpdate({ email: email }, { $set: { otpCode: otp, otpExpiration: expiration } }, { new: true })
            logger.info(`OTP updated for email: ${email}`);
            return temperoryUser
        } catch (error) {
            logger.error(`Error during updating OTP for email: ${email}, error: ${error.message}`);
        }
    },

    // Move from temperoryUser to permanent user
    moveTemperoryToUser: async (email) => {
        try {
            const tempUser = await TemperoryUser.findOne({ email: email })
            if (tempUser) {
                const permanentUser = new User({
                    username: tempUser.username,
                    email: tempUser.email,
                    password: tempUser.password
                })
                await permanentUser.save()
                await TemperoryUser.deleteOne({ email: email })
                logger.info(`Temperory user moved to permanent user: ${email}`);
                return permanentUser
            }
        } catch (error) {
            logger.error(`Error during moving temperory user to permanent user: ${email}, error: ${error.message}`);
        }
    },

    findUserByGoogleId: async (email) => {
        try {
            const user = await User.findOne({ email });
            logger.info(`User found by Google ID: ${email}`);
            return user;
        } catch (error) {
            logger.error(`Error during finding user by Google ID: ${email}, error: ${error.message}`);
        }
    },
    createUser: async (userData) => {
        try {
            const newUser = new User(userData)
            await newUser.save()
            logger.info(`User created: ${userData.email}`);
            return newUser
        } catch (error) {
            logger.error(`Error during user creation: ${userData.email}, error: ${error.message}`);
        }
    }
}

export default userRepository