import logger from "../../../Framework/Utilis/logger.js";
import adminUseCase from "../../../Application/Usecase/adminUsecase.js";

const recruiterController={
    getAllRecruiters: async (req, res) => {
        try {
          const page=parseInt(req.query.page) || 1
          const limit=parseInt(req.query.limit) || 10
          const companyName = req.query.companyName || '';
          const recruiters = await adminUseCase.getAllRecruiters(page,limit,companyName)
          if(recruiters.message){
            logger.warn(`Error fetching recruiters: ${recruiters.message}`)
          }
          logger.info(`Found ${recruiters.recruiters.length} recruiters`);
          res.status(200).json({ success: true, recruiters:recruiters.recruiters,total:recruiters.total,page:recruiters.page,limit:recruiters.limit })
        } catch (error) {
          logger.error(`Error fetching recruiters: ${error.message}`)
          res.status(500).json({ message: "Internal server error" })
        }
      },
      
      blockOrUnblockRecruiter:async(req,res)=>{
        try {
          const { id } = req.params;
          const result = await adminUseCase.recruiterBlockOrUnblock(id);
          if (result.message) {
            return res.status(400).json({ success: false, message: result.message });
          }
          res.status(200).json({ success: true, block: result.block });
        } catch (error) {
          logger.error(`Error blocking/unblocking recruiter: ${error.message}`);
          res.status(500).json({ message: 'Internal server error' });
        }
      }

}
export default recruiterController