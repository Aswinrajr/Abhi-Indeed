import { Chat } from "../../Core/Entities/chatCollection.js";
import { User } from "../../Core/Entities/userCollection.js";
import { Recruiter } from "../../Core/Entities/recruiterCollection.js";
import logger from "../Utilis/logger.js";
import { Message } from "../../Core/Entities/messageCollection.js";

const chatRepository = {
    // U
    findChat: async (jobId,userId,recruiterId) => {
        try {
            const existingRoom=await Chat.findOne({
                jobId,
                members:{$all:[userId,recruiterId]}
            })
            if (!existingRoom) {
                logger.info(`Chat not found for jobId: ${jobId}, userId: ${userId}, recruiterId: ${recruiterId}`);
                return null;
            }
            const recruiter = await Recruiter.findById(recruiterId).select('recruitername email _id');
            logger.info(`Chat found for jobId: ${jobId}, userId: ${userId}, recruiterId: ${recruiterId}`);
            return {
                chatRoom: existingRoom,
                recruiter
            };
            } catch (error) {
            logger.error(`Error finding chat: ${error.message}`);
        }
    },
    // U
    createChat: async (jobId, userId, recruiterId) => {
        try {
            const newChat = new Chat({
                members: [userId, recruiterId],
                jobId
            });
            const savedChat = await newChat.save();
            const recruiter = await Recruiter.findById(recruiterId).select('recruitername email _id');
            logger.info(`Chat created successfully for jobId: ${jobId}, userId: ${userId}, recruiterId: ${recruiterId}`);
            return {
                chatRoom: savedChat,
                recruiter
            };        
        } catch (error) {
            logger.error(`Error creating chat: ${error.message}`);
        }
    },

    getLatestMessageTimestamp:async(chatId)=>{
        try {
            const lastMessage=await Message.findOne({chatId}).sort({createdAt:-1})
            return lastMessage ? lastMessage.createdAt : null;
        } catch (error) {
            
        }
    },
    getChatsByRecruiter: async (recruiterId) => {
        try {
            const chats= await Chat.find({ members: recruiterId }).populate({
                path:'members',
                select:'username email',
                model:User
            })                        
            for (let chat of chats){
                chat.latestMessageTimestamp =await chatRepository.getLatestMessageTimestamp(chat._id)
            }
            chats.sort((a, b) => (b.latestMessageTimestamp || 0) - (a.latestMessageTimestamp || 0));
            logger.info('Fetched chats for recruiter successfully', { recruiterId, chatCount: chats.length });
            return chats;
        } catch (error) {
            logger.error(`Error getting chats for recruiter: ${error.message}`);
        }
    }
};

export default chatRepository;
