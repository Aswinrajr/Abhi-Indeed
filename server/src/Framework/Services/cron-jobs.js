import cron from 'node-cron'
import jobRepository from '../Repositories/jobRepository.js'
import logger from '../Utilis/logger.js'

cron.schedule('0 0 * * *',async()=>{
    try {
        const today = new Date();
        const expiredJobs=await jobRepository.deleteExpiredJobs(today)
        if (expiredJobs) {
            logger.info(`Deleted expired jobs: ${expiredJobs}`);
        } else {
            logger.info('No expired jobs found to delete');
        }
    } catch (error) {
        logger.error(`Error deleting expired jobs: ${error.message}`);
    }
})

export default cron