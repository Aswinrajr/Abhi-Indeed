import chatUseCase from "../../../Application/Usecase/chatUsecase.js";
import logger from "../../../Framework/Utilis/logger.js";
const chatController = {

    createRoom:async(req,res)=>{
        try {
            const {jobId,employerId}=req.body    
            const userId=req.user.user._id
            const room=await chatUseCase.createRoom(jobId,userId,employerId)
            if (room) {
                logger.info('Chat room created successfully', { room });
                return res.status(201).json({ success: true, message: "Room data", room });
            } else {
                logger.warn('Failed to create chat room', { jobId, employerId, userId });
                return res.json({ success: false, message: 'Failed to create room' });
            }
        } catch (error) {
            logger.error(`Error creating chat room: ${error.message}`, { error });
            res.status(500).json({ success: false, message: 'Error creating chat room' });            
        }
    },
    getChatRoom:async(req,res)=>{
        try {
            const {jobId,employerId}=req.params
            const userId=req.user.user._id
            const room=await chatUseCase.findChatRoom(jobId,userId,employerId)
            if (room) {
                logger.info('Chat room found', { room });
                return res.status(200).json({ success: true, room });
            } else {
                logger.warn('Chat room not found', { jobId, employerId, userId });
                return res.json({ success: false, message: 'No chat room found' });
            }
        } catch (error) {
            logger.error(`Error getting chat room: ${error.message}`);
            res.status(500).json({ success: false, message: 'Error getting chat room' });
        }
    },

    saveMessage:async(req,res)=>{
        try {
            const messageData=req.body
            const {message,room}=messageData
            console.log(room,"ROOM");
            
            const id=room
            const userId=req.user.user._id            
            const result=await chatUseCase.saveMessages(message,id,userId)
            if (result) {
                logger.info('Message saved successfully', { message, id, userId });
                return res.status(200).json({ success: true, message: 'Message saved', result });
            } else {
                logger.warn('Failed to save message', { message, id, userId });
                return res.status(400).json({ success: false, message: 'Failed to save message' });
            }
        } catch (error) {
            logger.error(`Error saving message: ${error.message}`, { error });
            res.status(500).json({ success: false, message: 'Error saving message' });            
        }
    },
    getMessages: async (req, res) => {
        try {
            const { chatId } = req.params;
            const messages = await chatUseCase.getMessages(chatId);
            res.status(200).json({ success: true, messages });
        } catch (error) {
            logger.error(`Error fetching messages: ${error.message}`);
            res.status(500).json({ success: false, message: 'Error fetching messages' });
        }
    }
};

export default chatController;
