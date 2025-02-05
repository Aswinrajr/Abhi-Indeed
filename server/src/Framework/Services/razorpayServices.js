import razorpay from "./razorpayConfig.js";
import logger from "../Utilis/logger.js";
import crypto from 'crypto';

const paymentService = {
  async createOrder(amount) {
    try {
      const options = {
        amount: amount * 100, 
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      };
      const order = await razorpay.orders.create(options);
      return order;
    } catch (error) {
      logger.error(`Failed to create order. Error: ${error.message}`, { error });
    }
  },

  verifyPaymentSignature(paymentId, orderId, signature) {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEYSECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  },

  async verifyPayment(paymentId, orderId, signature) {
    try {
      const isValid = this.verifyPaymentSignature(paymentId, orderId, signature);
      return { success: isValid, message: isValid ? 'Payment verified' : 'Invalid signature' };
    } catch (error) {
      logger.error(`Failed to verify payment. Error: ${error.message}`, { error });
    }
  }
}

export default paymentService;
