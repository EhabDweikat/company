const ChartServises = require('./Chart.services');

const router=require('express').Router();

router.post('/AddToChart',ChartServises.BuyMaterila);
router.delete('/CancelChart/:id',ChartServises.CanceldChart);




module.exports=router;