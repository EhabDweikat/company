const {Task,Worker,Attendance,Salary}= require('./Worker.module');
const Project= require('../projects/projects.modules');
const mongoose=require('mongoose');


const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

function checkFileType(file, cb) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png|gif/;

    //Check file extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        return cb('Error: Images Only!');
    }
}

// Initialize multer upload object
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Max file size 1 MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('media');



module.exports.AddWorker = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: err });
    }

    try {
      const existingWorker = await Worker.findOne({ name: req.body.name });
      if (existingWorker) {
        return res.status(400).json({ message: "Worker with the same name already exists", worker: existingWorker });
      }

      const newWorker = new Worker({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        salary: req.body.salary,
        media: req.file.filename,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      });

      const savedWorker = await newWorker.save();
      const salary = new Salary({
        worker: savedWorker._id,
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        amount: savedWorker.salary,
      });
      await salary.save();
      return res.status(201).json({ message: "Worker added successfully", worker: savedWorker });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });
};

module.exports.addTask = async (req, res) => {
  const { workerId } = req.params;
  const {name, description, status, startTime, endTime, reward, discount, latitude, longitude } = req.body;

  try {
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: "Worker Not Found" });
    }

    const project = await Project.findOne({name}).populate('tasks');
    if (!project) {
      return res.status(404).json({ message: "Project Not Found" });
    }

    const task = new Task({
      worker: worker._id,
      project: project._id,
      description,
      status,
      startTime,
      endTime,
      reward,
      discount,
      latitude,
      longitude,
    });

    await task.save();

    project.tasks.push(task);

    const totalTasks = project.tasks.length;
    console.log({message:'totalTasks',totalTasks});
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    console.log({message:'completedTasks',completedTasks});

    const percentageCompleted = Math.floor((completedTasks / totalTasks) * 100);
    console.log({message:'percentageCompleted',percentageCompleted});

    if (percentageCompleted >= 80) {
      project.status = 'completed';
    } else if (percentageCompleted >= 40 && percentageCompleted < 80) {
      project.status = 'pending';
    } else {
      project.status = 'overdue';
    }
    

    await project.save();

    res.status(201).json({ task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


/*module.exports.addTask = async (req, res) => {
  const { workerId } = req.params;
  const {  description, status, startTime, endTime, reward, discount, latitude, longitude } = req.body;

  try {
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: "Worker Not Found" });
    }

    const task = new Task({
      worker: worker._id,
      description,
      status,
      startTime,
      endTime,
      reward,
      discount,
      latitude,
      longitude,
    });

    await task.save();

    res.status(201).json({ task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
*/

  
  
module.exports.getWorkerTasks = async (req, res) => {
  const { workerId } = req.params;

  try {
    const worker = await Worker.findById(workerId);

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    const tasks = await Task.find({ worker: workerId }).populate('worker');

    res.json({ tasks });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports.updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task Not Found" });
    }

    const oldStatus = task.status;
    task.status = status;

    await task.save();

    if (status === "completed" && oldStatus !== "completed") {
      const project = await Project.findOne({ tasks: taskId });
      if (project) {
        if (!project.tasks.includes(taskId)) {
          project.tasks.push(taskId);
        }

        const completedTasks = await Promise.all(
          project.tasks.map(async (taskId) => {
            const task = await Task.findById(taskId);
            return task.status === "completed";
          })
        );

        const totalTasks = project.tasks.length;
        const numCompletedTasks = completedTasks.filter((completed) => completed).length;

        project.percentCompleted = Math.floor((numCompletedTasks / totalTasks) * 100);

        if (project.percentCompleted >= 80) {
          project.status = "completed";
        } else if (project.percentCompleted >= 40 && project.percentCompleted < 80) {
          project.status = "pending";
        } else {
          project.status = "overdue";
        }

        await project.save();

        console.log(`Percentage of completed tasks: ${project.percentCompleted}%`);
      }
    }

    res.status(200).json({ message: "Task status updated successfully", task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




  module.exports.addAttendance = async (req, res) => {
    const { workerId, date, present } = req.body;
  
    try {
      // Check if attendance record for the same date already exists
      const existingAttendance = await Attendance.findOne({ date: date });
  
      if (existingAttendance) {
        return res.status(400).json({ message: 'Attendance for this date already exists' });
      }
  
      // Create a new attendance record
      const attendance = new Attendance({
        worker: workerId,
        date,
        present
      });
      await attendance.save();
  
      // Add the attendance record to the worker's attendance array
      const worker = await Worker.findByIdAndUpdate(
        workerId,
        { $push: { attendance: attendance } },
        { new: true }
      );
  
      return res.status(200).json({
        message: 'Attendance added successfully',
        attendance,
        worker
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to add attendance', error: error.message });
    }
  };
  

      module.exports.showAttendance = async (req, res) => {
        const { workerId } = req.params;
      
        try {
          const worker = await Worker.findById(workerId);
          if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
          }
      
          const attendance = await Attendance.find({ worker: workerId });
          const presentDates = attendance.filter(record => record.present === true).map(record => record.date);
          const absentDates = attendance.filter(record => record.present === false).map(record => record.date);
      
          const totalWorkingDays = attendance.length;
          const totalPresentDays = presentDates.length;
          const totalAbsentDays = absentDates.length;
      
          res.status(200).json({
            presentDates,
            absentDates,
            totalWorkingDays,
            totalPresentDays,
            totalAbsentDays,
          });
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      };

      module.exports.getSalaryHistoryForWorker = async (req, res) => {
        const { workerId } = req.params;

  try {
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

   
    

    const report = {
      workerName: name,
      totalPresentDays,
      salaryPerDay: salary,
      totalSalary,
    };

    return res.status(200).json({ report });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
      };

      module.exports.getALLWorker = async (req, res) => {
        try {
          const workers = await Worker.find({});
      
          if (!workers) {
            return res.status(404).json({ message: 'There are no workers in your company' });
          } else {
            const workersWithImageUrl = workers.map(worker => {
              const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${worker.media}`;
              return {
                ...worker.toObject(),
                imageUrl
              };
            });
      
            return res.status(200).json({ message: 'Here are all the workers', workers: workersWithImageUrl });
          }
        } catch (error) {
          return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
      };

      // Function to get all tasks for a specific project
module.exports.getProjectTasks = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId).populate('tasks');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const tasks = project.tasks;
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    } else {
      // Remove the task from the project's task array
      const project = await Project.findOneAndUpdate(
        { tasks: taskId },
        { $pull: { tasks: taskId } },
        { new: true }
      );

      return res.status(200).json({ message: 'Task deleted successfully' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports.getAllTask=async(req,res)=>{
  try{
    const tasks=await Task.find();
    if(!tasks){
      return res.status(404).json({message:'No tasks found'});
    }else{
      res.status(200).json(tasks);
    }

  }catch(error){
    return res.status(500).json({ message: 'Internal server error', error: error.message });

  }

}

      
      
