const projectServices = require('./projects.services');

const router=require('express').Router();


router.get('/projectsALL',projectServices.getAllProjects);
router.get('/pending',projectServices.getPending);
router.get('/overdue',projectServices.getoverdue);
router.get('/:id',projectServices.getProjectid);
router.get('/completed',projectServices.getcompleted);
router.post('/AddProject',projectServices.creatNewproject);


module.exports=router;
