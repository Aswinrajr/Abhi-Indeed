import adminUseCase from "../../../Application/Usecase/adminUsecase.js"
import logger from "../../../Framework/Utilis/logger.js"

const adminController = {

  postLogin: async (req, res) => {
    try {
      const { email, password } = req.body
      const adminData = { email, password }
      const loginResult = await adminUseCase.adminLogin(adminData)
      if (loginResult.message) {
        logger.warn(`Admin login failed for ${email}: ${loginResult.message}`);
        res.status(400).json({ success: false, message: loginResult.message })
      } else {
        const { admin, token } = loginResult
        res.cookie('adminaccessToken', String(token), { httpOnly: true,secure:true,sameSite:'None', maxAge: 3600000 })
        logger.info(`Admin login successful: ${email}`);
        res.status(200).json({ success: true, message: "Admin login successfully", admin, token })
      }
    } catch (error) {
      logger.error(`Admin login error for ${req.body.email}: ${error.message}`);
      res.status(500).send({ message: "Internal server error" })
    }
  },
  adminVerified: async (req, res) => {
    try {
      logger.info(`Admin verification check`);
      res.status(200).json({ success: true, message: "Admin verified" })
    } catch (error) {
      logger.error(`Admin verification error: ${error.message}`);
      res.status(500).json({ message: "Internal server error" })
    }
  },
  getCountstatus:async(req,res)=>{
    try {
      const stats=await adminUseCase.getAdminStats()
      if(stats){
        logger.info(
          `Admin stats retrieved: Recruiters - ${stats.recruiters}, Candidates - ${stats.candidates}, Jobs - ${stats.jobs}`
        );
        return res.status(200).json({success:true,message: "Admin stats retrieved successfully",stats})
      }else{
        logger.warn(`Admin stats not found`);
        res.status(404).json({ success: false, message: "Stats not found" });
      }
    } catch (error) {
      logger.error(`Error retrieving admin stats: ${error.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getCategoryStats:async(req,res)=>{
    try {
      const result=await adminUseCase.getCategoryStats()
      if(result){
        logger.info(`Category stats retrieved successfully: ${JSON.stringify(result)}`);
        return res.status(200).json({
          success: true,
          message: 'Category stats retrieved successfully',
          categories: result
        });
      }else{
        logger.warn('No category statistics found.');
        return res.status(404).json({
          success: false,
          message: 'No category statistics found',
        });
      }
    } catch (error) {
      logger.error(`Error fetching category statistics: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
    }
  },
  adminLogout: async (req, res) => {
    try {
      res.clearCookie('adminaccessToken');
      logger.info(`Admin successfully logout ${req.admin.admin.email}`);
      res.status(200).json({ success: true, message: "Admin logout successfully" });
    } catch (error) {
      logger.error(`Logout error: ${error.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },
}

export default adminController;
