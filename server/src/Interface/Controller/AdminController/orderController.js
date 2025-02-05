import orderUseCase from "../../../Application/Usecase/orderUsecase.js";
import logger from "../../../Framework/Utilis/logger.js";

const orderController={
    getOrders:async(req,res)=>{
        try {
            const page=parseInt(req.query.page) || 1
            const limit=parseInt(req.query.limit) || 5
            const orders=await orderUseCase.getOrders(page,limit)
            if(orders.message){
                logger.warn(`Failed to retrieve plans: ${orders.message}`);
                return res.status(404).json({ success: false, message:orders.message });
            }
            logger.info(`Orders retrieved successfully. Page: ${page}, Limit: ${limit}`);
            return res.status(200).json({ success: true, orders:orders.orders, total:orders.total });
        } catch (error) {
            logger.error(`Error occurred while retrieving orders. Page: ${page}, Limit: ${limit}, Error: ${error.message}`, { error });
            return res.status(500).json({ success: false, message: 'Error retrieving orders' });
        }
    },
    getOrderStats:async(req,res)=>{
        try {
            const orderStats=await orderUseCase.getOrderStats()
            logger.info('Order statistics retrieved successfully');
            return res.status(200).json({ success: true,totalOrders:orderStats.totalOrders });
        } catch (error) {
            logger.error(`Error occurred while retrieving order statistics. Error: ${error.message}`, { error });
            return res.status(500).json({ success: false, message: 'Error retrieving order statistics' });
        }
    }

}
export default orderController