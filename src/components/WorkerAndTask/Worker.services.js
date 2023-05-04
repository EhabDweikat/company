const {Task,Worker}=require('./Worker.module');

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



module.exports.AddWorker=async (req, res) => {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: err });
      }
  
      try {
        const existingWorker = await Worker.findOne({ name: req.body.name });
        if (existingWorker) {
          return res.status(400).json({ message: "Worker With the same name Already Exisit", Worker: existingWorker });
        }
  
        const newWorker = new Worker({
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            salary:req.body.salary,
            media: req.file.filename,
        });
  
        const savedWorker = await newWorker.save();
        return res.status(201).json({ message: "Worker Added Succsefully", Worker: savedWorker });
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
    const { workerId } = req.params;
    const { date, present } = req.body;
  
    try {
      const worker = await Worker.findByIdAndUpdate(
        workerId,
        { $push: { attendance: { date, present } } },
        { new: true }
      );
  
      res.status(201).json({ worker });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  
  

