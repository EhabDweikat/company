const SubProjectServises = require('./subProject.services');

const router=require('express').Router();

router.post('/AddDetails',SubProjectServises.AddWorker);
router.get('/getWorkerbyProjectNumber/:ProjecctNumber',SubProjectServises.getWorkerbyName);
router.put('/updateDetails/:name',SubProjectServises.updateDetails);
router.delete('/deleteWorker/:name',SubProjectServises.deleteWorker);
router.get('/GetSpecificDetails/:ProjecctNumber',SubProjectServises.GetDetails);

module.exports=router;
