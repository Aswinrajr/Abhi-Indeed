import orderRepository from "../../Framework/Repositories/orderRepository.js";
import logger from "../../Framework/Utilis/logger.js";

const orderUseCase={
    getOrders:async(page,limit)=>{
        try {
            const {orders,total}=await orderRepository.getOrders(page,limit)
             
            if (!orders || orders.length === 0) {
                logger.warn(`No orders found for Page: ${page}, Limit: ${limit}`);
                return { message: "No orders found" };
            }
            logger.info(`Fetched ${orders.length} orders, Total orders: ${total}`);
            return { orders, total };
        } catch (error) {
            logger.error(`Error fetching orders for Page: ${page}, Limit: ${limit}. Error: ${error.message}`, { error });
        }
    },
    getOrderStats:async(month,week)=>{
        try {
            const [totalOrders]=await Promise.all([
                orderRepository.getTotalOrders()
            ])
            logger.info(`Order statistics fetched - Total Orders: ${totalOrders}`);
            return { totalOrders };
        } catch (error) {
            logger.error(`Error fetching order statistics. Error: ${error.message}`, { error });
        }
    }



}
export default orderUseCase