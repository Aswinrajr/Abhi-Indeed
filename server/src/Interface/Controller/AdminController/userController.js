import adminUseCase from "../../../Application/Usecase/adminUsecase.js"
import logger from "../../../Framework/Utilis/logger.js"

const userController={
    getAllCandidates: async (req, res) => {
        try {
          const page=parseInt(req.query.page) || 1
          const limit=parseInt(req.query.limit) || 10
          const candidates = await adminUseCase.getAllCandidates(page,limit)
          if(candidates.message){
            logger.warn(`Error fetching candidatess: ${candidates.message}`)
          }
          logger.info(`Found ${candidates.length} candidates`);
          res.status(200).json({ success: true, candidates:candidates.candidates,total:candidates.total,page:candidates.page,limit:candidates.limit })
        } catch (error) {
          logger.error(`Error fetching candidates: ${error.message}`)
          res.status(500).json({ message: "Internal server error" })
        }
      },
      blockOrUnblockUser: async (req, res) => {
        try {
          const { id } = req.params;
          const result = await adminUseCase.candidateBlockOrUnblock(id);
          if (result.message) {
            return res.status(400).json({ success: false, message: result.message });
          }
          res.status(200).json({ success: true, block: result.block });
        } catch (error) {
          logger.error(`Error blocking/unblocking user: ${error.message}`);
          res.status(500).json({ message: 'Internal server error' });
        }
      },
}
export default userController