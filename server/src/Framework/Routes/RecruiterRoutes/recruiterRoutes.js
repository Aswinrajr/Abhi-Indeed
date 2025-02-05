import express from 'express'
import recruiterController from '../../../Interface/Controller/RecruiterController/recruiterControl.js'
import jobController from '../../../Interface/Controller/RecruiterController/jobController.js'
import categoryController from '../../../Interface/Controller/RecruiterController/categoryController.js'
import Middleware from '../../../Interface/Middleware/authMiddleware.js'
import applicationController from '../../../Interface/Controller/RecruiterController/applicationController.js'
import planControl from '../../../Interface/Controller/RecruiterController/planController.js'
import chatController from '../../../Interface/Controller/RecruiterController/chatController.js'
const authMiddleware=Middleware.recruiterMiddleware

const router=express.Router()

router.post('/recruiter-signup',recruiterController.postRecruiterSignup)
router.post('/recruiter-verifyOtp',recruiterController.postVerifyOtp)
router.post('/recruiter-resentOtp',recruiterController.postResendOtp)
router.post('/recruiter-login',recruiterController.postLogin)
router.post('/recruiter-forgotPassword',recruiterController.postForgotPassword)
router.post('/recruiter-resetPassword/:token',recruiterController.postResetPassword)
router.get('/recruiter-verify',authMiddleware,recruiterController.recruiterVerified)
router.get('/recruiter-logout',authMiddleware,recruiterController.postLogout)
router.get('/recruiter-getRecruiterDetails/:email',authMiddleware,recruiterController.getRecruiterDetails)

// Job related routes
router.post('/recruiter-postJob',authMiddleware,jobController.postJob)
router.get('/recruiter-showJobs/:id',authMiddleware,jobController.showJobs)
router.get('/recruiter-viewJob/:id',authMiddleware,jobController.showIndividualJob)
router.delete('/recruiter-deleteJob/:id',authMiddleware,jobController.deleteJob)
router.put('/recruiter-updateJob/:id',authMiddleware,jobController.editJob)

// Category route
router.get('/recruiter-getAllCategories',authMiddleware,categoryController.getAllCategories)

// Job application related routes
router.get('/recruiter-getApplication/:id',authMiddleware,applicationController.getApplication)
router.get('/recruiter-getApplicationDetails/:id',authMiddleware,applicationController.getApplicationDetails)
router.put('/recruiter-updateApplicationStatus/:id',authMiddleware,applicationController.updateStatus)

// Plan related routes
router.get('/recruiter-getPlans',planControl.getPlansForRecruiter)
router.post('/recruiter-createOrder',recruiterController.createOrder)
router.post('/recruiter-verifyPayment',recruiterController.verifyPayment)

// Chat related routes
router.get('/recruiter-chats',authMiddleware,chatController.getChatByRecruiter)
router.post('/recruiter-sendMessage',authMiddleware,chatController.sendMessage)
router.get('/recruiter-getMessages/:chatId',authMiddleware,chatController.getMessagesByChat)


export {router as RecruiterRouter}
