import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const generateJWT=async(email,role)=>{
    try {
        const token=jwt.sign({email:email,role:role},process.env.KEY,{expiresIn:'1h'})
        return token
    } catch (error) {
        console.log(error);
    }
}

export const generateRefreshToken=async(email)=>{
    try {
        const refreshToken=jwt.sign({email:email},process.env.REFRESH_TOKEN_KEY,{expiresIn:'7d'})
        return refreshToken
    } catch (error) {
        console.log(error);
    }
}
