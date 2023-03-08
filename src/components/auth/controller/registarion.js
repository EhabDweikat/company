
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const {sendEmail}=require('../../../services/email');   
const userModel = require("../../users/user.modules");

const signup=async(req,res)=>{
    try{

    
    const{name,email,password}=req.body
    const user=await userModel.findOne({email}).select('email');
    if (user){
        res.status(409).json({message:'Email is already exist'});

    }else{
        bcrypt.hash(password,parseInt(process.env.SALTROUND) , async function(err, hash) {
            const newuser= new userModel({name,email,password:hash});

            const token = jwt.sign({ id: newuser._id },process.env.emailToken, { expiresIn: '1h' });

            const link=`${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`; 
            const message=`<a href ='${link}'>verify your email <\a>`;

            const info=await sendEmail(email,`confirm Email`,message);
                 if(info.accepted?.length>0) {
            const savedUser =await newuser.save();
            res.status(201).json({message:"Success",savedUser:savedUser._id});

                 }else{
                    res.status(404).json({message:"errror"})
                 }
                });
    }
}catch(error){
res.status(500).json({message:"catch error",error});
}
}

const confirmEmail=async (req,res)=>{
    try {
        
const {token}=req.params;
const decoded=jwt.verify(token,process.env.emailToken);
if(!decoded.id){
    res.status(400).json({message:"invalid paylod"});
}else{
    const user =await userModel.findOneAndUpdate({
        _id:decoded.id,
        verified:false
    },{
        verified:true
    });
    res.status(200).redirect(process.env.FURL);
}

    } catch (error) {
        res.status(500).json({message:'catch error',error});

    }
}

const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await userModel.findOne({email});
        if(!user){
            res.status(404).json({message:'email not exist'})
        }else{
            const match=await bcrypt.compare(password,user.password);
            if(!match){
                res.status(400).json({message:'invalid password'})
            }else{
                const token =jwt.sign({id:user._id},process.env.tokenSignature,{expiresIn:60 * 60 * 24});
                res.status(200).json({message:'sucsess',token});
            }
        }

    }catch(error){
        res.status(500).json({message:'catch error',error});

    }
}

module.exports={signup,confirmEmail,login};