

const router=require('express').Router();
const registerController=require('./controller/registarion.js')
router.post('/signup',registerController.signup);
router.get('/confirmEmail/:token',registerController.confirmEmail)
router.get('/login',registerController.login)
//update password and reset
router.post('/forgetPassword', registerController.forgetPassword); // new route for forgetting password
router.post('/resetPassword/:token', registerController.resetPassword); // new route for resetting password


module.exports=router;