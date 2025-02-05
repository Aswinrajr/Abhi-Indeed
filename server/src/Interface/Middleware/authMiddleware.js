import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import userUseCase from '../../Application/Usecase/userUsecase.js'
import recruiterUseCase from '../../Application/Usecase/recruiterUsecase.js'
import adminUseCase from '../../Application/Usecase/adminUsecase.js'
import companyUseCase from '../../Application/Usecase/companyUsecase.js'
import { generateJWT } from '../../Framework/Services/jwtServices.js'
import { generateRefreshToken } from '../../Framework/Services/jwtServices.js'
dotenv.config()

const Middleware={
    refreshTokens:async(refreshToken)=>{
        try {
            const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
            const user=await userUseCase.getUserByEmail(decoded.email)
            if(!user || user.block){
                return null
            }
            const newAccessToken = await generateJWT(user.email, user.role);
            const newRefreshToken = await generateRefreshToken(user.email);
            return { token: newAccessToken, refreshToken: newRefreshToken, user };
        } catch (error) {
            console.error('Error refreshing tokens:', error);
            return null;
        }
    },

    authMiddleware:async(req,res,next)=>{
        try {
            const token=req.cookies.accessToken
            const refreshToken=req.cookies.refreshToken
            if(!token && !refreshToken){
                return res.status(400).json({message:"Access denied. No token found"})
            }
            try {
                const decoded=jwt.verify(token,process.env.KEY)
                const user=await userUseCase.getUserByEmail(decoded.email)
                if(!user){
                    return res.status(401).json({message:"User not found"})
                }
                if (user.block) {
                    res.clearCookie('accessToken');
                    res.clearCookie('refreshToken')
                    return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
                }
                req.user={...user,role:decoded.role}
                next()
            } catch (error) {
              if(refreshToken){
                const newTokens=await refreshTokens(refreshToken)
                if(newTokens){
                    res.cookie('accessToken', newTokens.token, { httpOnly: false, maxAge: 3600000 });
                    res.cookie('refreshToken', newTokens.refreshToken, { httpOnly: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
                    req.user = { ...newTokens.user };
                    next();
                }else{
                    return res.status(401).json({ message: 'Invalid refresh token' });
                }
              }else{
                return res.status(401).json({ message: 'Invalid token' });
              }
            }   
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
         
    },
    recruiterMiddleware:async(req,res,next)=>{
        try {
            const token=req.cookies.recruiteraccessToken
            if(!token){
            return res.status(400).json({message:"Access denied. No token found"})
            }
            const decoded=jwt.verify(token,process.env.KEY)
            const recruiter=await recruiterUseCase.getRecruiterByEmail(decoded.email)
            if(!recruiter){
                return res.status(401).json({message:"Recruiter not found"})
            }
            if (recruiter.block) {
                res.clearCookie('recruiteraccessToken');
                return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
            }
            req.recruiter = {
                ...recruiter,
                email: decoded.email,
                role:decoded.role
            };
            next()
    
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    },
    adminMiddleware:async(req,res,next)=>{
        try {
            const token=req.cookies.adminaccessToken
            if(!token){
                return res.status(400).json({message:"Access denied. No token found"})
            }
            const decoded=jwt.verify(token,process.env.KEY)
            const admin=await adminUseCase.getAdminByEmail(decoded.email)
            if(!admin){
                return res.status(401).json({message:"Admin not found"})
            }
            req.admin={
                ...admin,
                email: decoded.email,
                role:decoded.role 
            }
            next()
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    },
    companyMiddleware:async(req,res,next)=>{
        try {
            const token=req.cookies.companyaccessToken
        if(!token){
            return res.status(400).json({message:"Access denied. No token found"})
        }
        const decoded=jwt.verify(token,process.env.KEY)                
        const company=await companyUseCase.getCompanyByEmail(decoded.email)                
        if(!company){
            return res.status(401).json({message:"Company not found"})
        }
        if (company.block) {
            res.clearCookie('companyaccessToken');
            return res.status(403).json({ message: 'Your account has been blocked. Please contact support.'});
        }
        req.company= company
        next()
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'Invalid token' });
        }   
    }
}

export default Middleware