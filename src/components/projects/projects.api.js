const projectServices = require('./projects.services');
const CategoryModel=require('./projects.modules');

const router=require('express').Router();


router.get('/projectsALL',projectServices.getAllProjects);
router.get('/pending',projectServices.getPending);
router.get('/overdue',projectServices.getOverdue);
router.get('/:id',projectServices.getProjectid);
router.get('/completed',projectServices.getCompleted);
router.post('/AddProject',projectServices.creatNewproject);
router.get('/projectByName/:name',projectServices.getbyName);

router.put('/updateProject/:id',projectServices.updateProject);





module.exports=router;
