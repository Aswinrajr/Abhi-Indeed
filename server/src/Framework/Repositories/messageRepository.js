import { Message } from "../../Core/Entities/messageCollection.js";
import logger from "../Utilis/logger.js";

const messageRepository = {

    // U
    saveMessage: async (message, id, userId) => {
        try {
            const newMessage = new Message({
                text: message,
                chatId: id,
                senderId: userId
            });
            const savedMessage = await newMessage.save();
            logger.info(`Message saved successfully for chatId: ${id}`, { message: savedMessage });
            return savedMessage;
            } catch (error) {
                logger.error(`Error saving message for chatId: ${id}, userId: ${userId}: ${error.message}`);            
        }
    },
    // U
    getMessagesByChatId: async (chatId) => {
        try {
            console.log(chatId,"IS");
            const messages = await Message.find({chatId:chatId}).sort({ createdAt: 1 });
             console.log(messages,"MESSAGES");
            if (messages.length) {
                logger.info(`Messages fetched successfully for chatId: ${chatId}`, { messages });
            } else {
                logger.warn(`No messages found for chatId: ${chatId}`);
            }
            return messages;
          } catch (error) {
            logger.error(`Error getting messages for chatId: ${chatId}: ${error.message}`);
        }
    }
};

export default messageRepository;
