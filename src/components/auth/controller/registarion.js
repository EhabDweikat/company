
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const {sendEmail}=require('../../../services/email');   
const userModel = require("../../users/user.modules");

const signup = async (req, res) => {
  try {
      const { name, email, password, confirmPassword, age, country } = req.body;

      if (password !== confirmPassword) {
          return res.status(400).json({ message: 'Passwords do not match' });
      }

      const user = await userModel.findOne({ email }).select('email');

      if (user) {
          return res.status(409).json({ message: 'Email is already exist' });
      }

      bcrypt.hash(password, parseInt(process.env.SALTROUND), async function (err, hash) {
          const newuser = new userModel({ name, email, password: hash, age, country });

          const token = jwt.sign({ id: newuser._id }, process.env.emailToken, { expiresIn: '1h' });

          const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`;
          const message = `<a href ='${link}'>verify your email <\a>`;

          const info = await sendEmail(email, `confirm Email`, message);

          if (info.accepted?.length > 0) {
              const savedUser = await newuser.save();
              res.status(201).json({ message: "Success", savedUser: savedUser._id });
          } else {
              res.status(404).json({ message: "error" })
          }
      });
  } catch (error) {
      res.status(500).json({ message: "catch error", error });
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
                if(!user.verified){
                    res.status(400).json({message:'plz confirm your email'});

                }else{
                    if(!user.isActive){
                        res.status(400).json({message:'your account is blocked'});

                    }else{
                        const token =jwt.sign({id:user._id},process.env.tokenSignature,{expiresIn:60 * 60 * 24});
                res.status(200).json({message:'sucsess',token});
                    }
                }
              
            }
        }

    }catch(error){
        res.status(500).json({message:'catch error',error});

    }
}


const forgetPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await userModel.findOne({ email }).select("email");
  
      if (!user) {
        res.status(404).json({ message: "Email not found" });
        return;
      }
  
      const token = jwt.sign({ id: user._id }, process.env.emailToken, {
        expiresIn: "1h",
      });
  
      const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/resetPassword/${token}`;
      const message = `<a href ='${link}'>reset your password <\a>`;
  
      const info = await sendEmail(email, "Reset Password", message);
      if (info.accepted?.length > 0) {
        res.status(200).json({ message: "Reset password link sent to email" });
      } else {
        res.status(500).json({ message: "Error sending email" });
      }
    } catch (error) {
      res.status(500).json({ message: "catch error", error });
    }
  };
  
  const resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
  
      const decoded = jwt.verify(token, process.env.emailToken);
      if (!decoded.id) {
        res.status(400).json({ message: "Invalid payload" });
        return;
      }
  
      const user = await userModel.findOne({ _id: decoded.id }).select("password");
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
  
      bcrypt.hash(password, parseInt(process.env.SALTROUND), async function (err, hash) {
        user.password = hash;
        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
      });
    } catch (error) {
      res.status(500).json({ message: "catch error", error });
    }
  };

  const getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await userModel.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      console.log(user); // This will print the user information to the console
      res.status(200).json({ message: "User retrieved successfully", user });
    } catch (error) {
      res.status(500).json({ message: "catch error", error });
    }
  };

  const getUser=async(req,res)=>{
   let users=await userModel.find();
    res.json(users);
  }
  
  module.exports = { signup, confirmEmail, login, forgetPassword, resetPassword,getUserById,getUser};