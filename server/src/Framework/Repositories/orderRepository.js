import { Orders } from "../../Core/Entities/orderCollection.js";
import { Recruiter } from "../../Core/Entities/recruiterCollection.js";
import logger from "../Utilis/logger.js";

const orderRepository={

    createNewOrder:async(orderData)=>{
        try {
            const newOrder=new Orders(orderData)
            const savedOrder=await newOrder.save()
            logger.info(`New order created successfully with ID: ${savedOrder._id} for user: ${orderData.userId}`);
            return savedOrder; 
        } catch (error) {
            logger.error(`Failed to create a new order for user: ${orderData.userId}. Error: ${error.message}`, { error });
        }
    },
    getOrders:async(page,limit)=>{
        try {
            const skip=(page-1)*limit
            const orders=await Orders.find().populate('userId','recruitername companyName').populate('planId','planName').skip(skip).limit(limit)
            const total=await Orders.countDocuments()
            logger.info(`Fetched ${orders.length} orders from page ${page} with limit ${limit}`);
            return {orders,total}
        } catch (error) {
            logger.error(`Failed to fetch orders for page ${page}. Error: ${error.message}`, { error });
        }
    },
    getTotalOrders:async()=>{
        try {
            const totalOrders = await Orders.countDocuments({});
            logger.info(`Total orders count: ${totalOrders}`);
            return totalOrders;
        } catch (error) {
            logger.error('Error fetching total orders', error);
        }
    }

}

export default orderRepository