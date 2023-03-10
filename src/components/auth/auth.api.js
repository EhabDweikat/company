

const router=require('express').Router();
const registerController=require('./controller/registarion.js')
router.post('/signup',registerController.signup);
router.get('/confirmEmail/:token',registerController.confirmEmail)
router.get('/login',registerController.login)
router.get('/users/:id',registerController.getUserById);
//update password and reset
router.post('/forgetPassword', registerController.forgetPassword); // new route for forgetting password
router.post('/resetPassword/:token', registerController.resetPassword); // new route for resetting password
router.get('/hello',(req,res)=>{
    res.json({message:'hellow word'});
});


module.exports=router;