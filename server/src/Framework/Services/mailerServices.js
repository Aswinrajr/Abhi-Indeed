import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()


class EmailService{
    constructor(){
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL,
              pass:process.env.PASSWORD
            }
          }); 
    }
    async sendOtpEmail(recipient, otp) {
        const mailOptions = {
          from: "workstation@gmail.com",
          to: recipient,
          subject: "OTP Verification",
          text: `Your OTP is: ${otp}. Please don't share your otp with others`,
          html: `<p>Your OTP is: <strong>${otp}</strong>.`
        };
        try {
          const info = await this.transporter.sendMail(mailOptions);
        } catch (error) {
          console.log(error);
        }
      }
}




export default EmailService