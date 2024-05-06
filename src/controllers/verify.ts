import { Request,Response } from "express";
import 'dotenv/config';
const speakeasy = require("speakeasy");

function verifyOTP(otp:string,key:string) {
    const verified = speakeasy.totp.verify({
      secret: key,
      encoding: "base32",
      token: otp,
    });
  
    return verified;
}

export const verifyToken = async(req:Request,res:Response)=>{
    const {otp,key} = req.query;
    
    try {
        const verify = verifyOTP(otp as string,key as string);
        if(verify) return res.status(200).json({message:"Otp verified"});
        return res.status(401).json({message:"Otp is wrong"});
    } catch (error) {
        return res.status(500).json({error:"Internal server error"});
    } 
}