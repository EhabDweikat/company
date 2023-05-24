const WorkerServises = require('./Worker.services');

const router=require('express').Router();

router.post('/AddWorker',WorkerServises.AddWorker);
router.post('/AddTask/:workerId',WorkerServises.addTask);
router.get('/tasks/:workerId', WorkerServises.getWorkerTasks);
router.put('/:taskId', WorkerServises.updateTaskStatus);
router.post('/AddAttendance',WorkerServises.addAttendance);
router.get('/ShowAttendance/:workerId', WorkerServises.showAttendance);
router.get('/ShowSalaryHistory/:workerId', WorkerServises.getSalaryHistoryForWorker);
router.get('/GetAllWorker', WorkerServises.getALLWorker);
router.get('/getProjectTasks/:projectId', WorkerServises.getProjectTasks);
router.delete('/delete/:taskId',WorkerServises.deleteTask);








module.exports=router;
