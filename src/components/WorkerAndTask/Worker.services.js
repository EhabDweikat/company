const {Task,Worker,Attendance,Salary}=require('./Worker.module');

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
    const { description, status, startTime, endTime, reward, discount } = req.body;
  
    try {
      const worker = await Worker.findById(workerId);
      if (!worker) {
        return res.status(404).json({message:"Worker Not Founded"});
      }
  
      const task = new Task({
        worker: worker._id,
        description,
        status,
        startTime,
        endTime,
        reward,
        discount,
      });
  
      await task.save();
  
      res.status(201).json({ task });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  module.exports.getWorkerTasks = async (req, res) => {
    const { workerId } = req.params;
  
    try {
      // Find all the tasks assigned to the worker
      const tasks = await Task.find({ worker: workerId }).populate('worker');
  
        res.json({ tasks });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  module.exports.updateTaskStatus = async (req, res) => {
    const {  status } = req.body;
    const { workerId,taskId } = req.params;
  
    try {
      const task = await Task.findOneAndUpdate(
        { _id: taskId, worker: workerId },
        { status },
        { new: true }
      );
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      res.json({ message:'The Status of your Tasked Changed Sucss' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  module.exports.addAttendance = async (req, res) => {
        const { workerId, date, present } = req.body;
        
        try {
          // create a new attendance record
          const attendance = new Attendance({
            worker: workerId,
           date,
            present
          }) 
          await attendance.save();

          
          // add the attendance record to the worker's attendance array
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
          return res.status(500).json({message: 'Failed to add attendance',error: error.message});
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
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
      
        const salaryHistory = [];
      
        for (let month = 1; month <= currentMonth; month++) {
          const numTasksCompleted = await Task.countDocuments({
            worker: workerId,
            status: 'completed',
            $expr: {
              $and: [
                { $eq: [{ $year: '$endTime' }, currentYear] },
                { $eq: [{ $month: '$endTime' }, month] },
              ],
            },
          });
      
          const salary = await Salary.findOne({
            worker: workerId,
            month: month,
            year: currentYear,
          });
      
          const bonus = {};
      
          if (salary) {
            if (numTasksCompleted >= 5) {
              bonus.amount = salary.amount * 0.1;
              bonus.description = 'Bonus for completing 5 or more tasks';
            }
      
            salaryHistory.push({
              month: month,
              year: currentYear,
              amount: salary.amount,
              bonus: bonus,
              numTasksCompleted: numTasksCompleted,
            });
          } else {
            salaryHistory.push({
              month: month,
              year: currentYear,
              amount: 0,
              bonus: bonus,
              numTasksCompleted: numTasksCompleted,
            });
          }
        }
      
        return res.json({ salaryHistory });
      };
      