
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const {sendEmail}=require('../../../services/email');   
const userModel = require ("../../users/user.modules");

const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, age, country, balance } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await userModel.findOne({ email }).select('email');

    if (user) {
      return res.status(409).json({ message: 'Email is already exist' });
    }

    const verificationCode = generateVerificationCode(); // Generate a random 4-digit verification code

    bcrypt.hash(password, parseInt(process.env.SALTROUND), async function (err, hash) {
      const newuser = new userModel({ name, email, password: hash, age, country, balance, verificationCode });

      const token = jwt.sign({ id: newuser._id }, process.env.emailToken, { expiresIn: '1h' });

      const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`;
      const message = `<a href ='${link}'>verify your email <\a>`;
      const messageOne = `Thank you for signing up. Your verification code is: ${verificationCode}`;

      const info = await sendEmail(email, `Confirm Email`, message, messageOne);

      if (info.accepted?.length > 0) {
        const savedUser = await newuser.save();
        res.status(201).json({ message: 'Success', savedUser: savedUser._id });
      } else {
        res.status(404).json({ message: 'Error sending email' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'catch error', error });
  }
};

const confirmEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.emailToken);
    if (!decoded.id) {
      res.status(400).json({ message: 'Invalid payload' });
    } else {
      const user = await userModel.findOneAndUpdate(
        {
          _id: decoded.id,
          verified: false,
          verificationCode: req.body.verificationCode, // Add verification code check
        },
        {
          verified: true,
        }
      );
      if (user) {
        res.status(200).json({ message: 'Email verified successfully' });
        // Redirect to the login page or any other desired URL
          return res.redirect(process.env.FURL);
      } else {
        res.status(404).json({ message: 'User not found or verification code is incorrect' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'catch error', error });
  }
};

const generateVerificationCode = () => {
  const code = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
  return code.toString();
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    if (!user.verified) {
      return res.status(400).json({ message: 'Please confirm your email' });
    }

    if (!user.isActive) {
      return res.status(400).json({ message: 'Your account is blocked' });
    }

    const token = jwt.sign({ id: user._id }, process.env.tokenSignature, { expiresIn: '1h' });

    res.status(200).json({ message: 'Success', token });
  } catch (error) {
    res.status(500).json({ message: 'catch error', error });
  }
};

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
    const message = `<a href ='${link}'>Click here to reset your password</a>`;

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
 
  
  module.exports = { signup, confirmEmail, login, forgetPassword, resetPassword};