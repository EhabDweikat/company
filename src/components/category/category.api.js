const{creatCategory,getCategories, getCategory}=require('./category.services');
const router=require('express').Router();


router.route('/').post(creatCategory).get(getCategories);
router.route('/:id').get(getCategory);
module.exports=router;
