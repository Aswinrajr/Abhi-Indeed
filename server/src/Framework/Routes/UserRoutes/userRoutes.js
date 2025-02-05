import express from 'express'
import userController from '../../../Interface/Controller/UserController/userControl.js'
import jobController from '../../../Interface/Controller/RecruiterController/jobController.js'
import jobControl from '../../../Interface/Controller/UserController/jobControl.js'
import chatController from '../../../Interface/Controller/UserController/chatControl.js'
import middleware from '../../../Interface/Middleware/authMiddleware.js'
import multer from 'multer'
import passport from 'passport'
const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router()
const authMiddleware = middleware.authMiddleware

router.post('/employee-signup', userController.postSignup)
router.post('/employee-verifyOtp', userController.postVerifyOtp)
router.post('/employee-resentOtp', userController.postResendOtp)
router.post('/employee-forgotPassword', userController.postForgotPassword)
router.post('/employee-resetPassword/:token', userController.postResetPassword)
router.post('/employee-login', userController.postLogin)
router.get('/employee-logout', authMiddleware, userController.postLogout)
router.get('/verify', authMiddleware, userController.isVerified)

// Profile routes
router.get('/employee-details/:email', userController.getUser)
router.put('/employee-updateContact', authMiddleware, userController.userUpdate)
router.post('/employee-addQualification/education/:email', userController.addEducation)
router.put('/employee-editEducation/:id', authMiddleware, userController.editEducation)
router.delete('/employee-deleteEducation/:id', authMiddleware, userController.deleteEducation)
router.post('/employee-addQualification/skill/:email', userController.addSkill)
router.put('/employee-editSkill/:email', authMiddleware, userController.editSkill)
router.delete('/employee-delteSkills/:skill', authMiddleware, userController.deleteSkill)
router.get('/employee-getDescription/:id', authMiddleware, userController.getDescription)
router.put('/employee-addDescription', authMiddleware, userController.addDescription)
router.post('/employee-addworkexperience', authMiddleware, userController.addWorkExperience)
router.put('/employee-editWorkExperience/:id', authMiddleware, userController.editWorkExperience)
router.delete('/employee-deleteWorkExperience/:experienceId', authMiddleware, userController.deleteWorkExperience)
router.get('/employee-getWorkExperience', authMiddleware, userController.getWorkExperience)
router.post('/employee-addResume', upload.single('resume'), authMiddleware, userController.addResume)
router.delete('/employee-deleteResume', authMiddleware, userController.deleteResume)
router.get('/employee-getResumeUrl', authMiddleware, userController.getResumeUrl)


// Job related routes
router.get('/employee-listJobs', jobController.getAllJobs)
router.get('/employee-getIndividualJobDetails/:id', authMiddleware, jobControl.getIndividualJob)
router.post('/employee-applyJob', authMiddleware, jobControl.applyJob)
router.get('/employee-checkApplied/:id', authMiddleware, jobControl.checkAlreadyApplied)
router.get('/employee-unappliedJobs', authMiddleware, jobControl.getUnappliedJobs)

// Job application
router.get('/employee-getApplications', authMiddleware, jobControl.getApplications)
router.get('/employee-getSearchApplication', authMiddleware, jobControl.getSearchApplication)

// Report job
router.post('/employee-jobReport', authMiddleware, jobControl.reportJob)
router.get('/employee-checkReported/:id', authMiddleware, jobControl.checkIfReported)

// Review and rating
router.get('/employee-checkReview/:companyId', authMiddleware, jobControl.checkReviewExists)
router.post('/employee-addReviewAndRating', authMiddleware, jobControl.addReviewAndRating)
router.get('/employee-individualReviews', authMiddleware, jobControl.getIndividualReviews)
router.delete('/employee-deleteIndividualReviews/:reviewId', authMiddleware, jobControl.deleteIndividualReview)
router.put('/employee-updateReview/:reviewId', authMiddleware, jobControl.updateReview)

// User side company related routes
router.get('/employee-getCompanies', userController.getCompanies)
router.get('/employee-getCompanyDetails/:id', userController.getCompanyDetails)

// Category listing route
router.get('/employee-getCategories', jobControl.getCategories)

// Chat/message routes
router.get('/employee-getChatRoom/:jobId/:employerId', authMiddleware, chatController.getChatRoom)
router.post('/employee-createRoom', authMiddleware, chatController.createRoom)
router.post('/employee-sendMessage', authMiddleware, chatController.saveMessage)
router.get('/employee-getMessages/:chatId', authMiddleware, chatController.getMessages)
// router.post('/employee-uploadChatfile',upload.single('file'),authMiddleware)

// Google authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "https://workstation.today/employee-login", }), userController.handlePassport);

export { router as UserRouter }