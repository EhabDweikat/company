const WorkerServises = require('./Worker.services');

const router=require('express').Router();

router.post('/AddWorker',WorkerServises.AddWorker);
router.post('/AddTask/:workerId/:projectId',WorkerServises.addTask);
router.get('/tasks/:workerId', WorkerServises.getWorkerTasks);
router.put('/:projectId/:workerId/tasks/:taskId', WorkerServises.updateTaskStatus);
router.post('/AddAttendance',WorkerServises.addAttendance);
router.get('/ShowAttendance/:workerId', WorkerServises.showAttendance);
router.get('/ShowSalaryHistory/:workerId', WorkerServises.getSalaryHistoryForWorker);







module.exports=router;
