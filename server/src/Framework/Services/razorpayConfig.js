import Razorpay from 'razorpay'
import dotenv from 'dotenv'
dotenv.config()


const razorpay=new Razorpay({
    key_id: 'rzp_test_Q1L0rbsJ5w1CpD',
    key_secret: process.env.RAZORPAY_KEYSECRET

})

export default razorpay