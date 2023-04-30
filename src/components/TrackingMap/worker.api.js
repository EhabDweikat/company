const WorkerServices = require('./worker.services');
const router=require('express').Router();
router.post('/AddWorker',WorkerServices.AddWorker);








module.exports=router;