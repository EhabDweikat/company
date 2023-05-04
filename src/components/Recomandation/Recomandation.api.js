const RecomandationServises = require('./Recomandation.services');

const router=require('express').Router();


router.get('/Recomandation/:id',RecomandationServises.getRecommendedMaterials);






module.exports=router;
