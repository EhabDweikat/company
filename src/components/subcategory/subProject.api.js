const SubProjectServises = require('./subProject.services');

const router=require('express').Router();

router.post('/AddDetails',SubProjectServises.AddWorker);
router.get('/getWorkerbyName/:name',SubProjectServises.getWorkerbyName);
//deleteWorker
router.put('/updateDetails/:name',SubProjectServises.updateDetails);
router.delete('/deleteWorker/:name',SubProjectServises.deleteWorker);


module.exports=router;
