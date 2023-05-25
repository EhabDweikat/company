

const router=require('express').Router();
const registerController=require('./controller/registarion.js')
router.post('/signup',registerController.signup);
router.get('/confirmEmail',registerController.confirmEmail)
router.get('/login',registerController.login)

//update password and reset
router.post('/forgetPassword', registerController.forgetPassword); // new route for forgetting password
router.post('/resetPassword', registerController.resetPassword); // new route for resetting password






module.exports=router;