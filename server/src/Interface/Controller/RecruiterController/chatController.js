import chatUseCase from "../../../Application/Usecase/chatUsecase.js";
import logger from "../../../Framework/Utilis/logger.js";

const chatController={
    getChatByRecruiter:async(req,res)=>{
        try {
            const recruiterId=req.recruiter.recruiter._id.toString()            
            const chats=await chatUseCase.getChatsByRecruiter(recruiterId)            
            if (chats) {
                logger.info(`Chats fetched successfully for recruiter: ${recruiterId}`, { chats });
                return res.status(200).json({ success: true, chats });
            } else {
                logger.warn(`No chats found for recruiter: ${recruiterId}`);
                return res.status(404).json({ success: false, message: 'No chats found' });
            }
        } catch (error) {
            logger.error(`Error fetching chats for recruiter: ${error.message}`);
            res.status(500).json({ success: false, message: 'Error fetching chats for recruiter' });
        }
    },
    sendMessage:async(req,res)=>{
        try {
            const {chatId,message}=req.body            
            const recruiterId=req.recruiter.recruiter._id.toString()
            const newMessage=await chatUseCase.saveMessages(message,chatId,recruiterId)            
            if (newMessage) {
                logger.info(`Message sent successfully for chat: ${chatId}`, { newMessage });
                return res.status(200).json({ success: true, message: newMessage });
            } else {
                logger.warn(`Failed to send message for chat: ${chatId} by recruiter: ${recruiterId}`);
                return res.status(400).json({ success: false, message: 'Failed to send message' });
            }    
            } catch (error) {
            logger.error(`Error sending message: ${error.message}`);
            res.status(500).json({ success: false, message: 'Error sending message' });
        }
    },
    getMessagesByChat:async(req,res)=>{
        try {
            const { chatId } = req.params;
            const messages = await chatUseCase.getMessages(chatId);
            if (messages) {
                logger.info(`Messages fetched successfully for chat: ${chatId}`, { messages });
                return res.status(200).json({ success: true, messages });
            } else {
                logger.warn(`No messages found for chat: ${chatId}`);
                return res.status(404).json({ success: false, message: 'No messages found' });
            }
        } catch (error) {
            logger.error(`Error fetching messages for chat: ${error.message}`);
            res.status(500).json({ success: false, message: 'Error fetching messages' });
        }
    }
}
export default chatController;