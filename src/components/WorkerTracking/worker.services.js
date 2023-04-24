const Workermodule=require('./worker.module');
const WebSocket =require('ws');
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

    // Check file extension
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
    limits: { fileSize: 1000000 }, // Max file size 1 MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('media');

// Function to create a new project
// Function to create a new worker
module.exports.AddWorker = async (req, res) => {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: err });
      }
  
      try {
        const existingWorker = await WorkerModel.findOne({ name: req.body.name });
        if (existingWorker) {
          return res.status(400).json({ message: "The worker with the same name already exists", worker: existingWorker });
        }
  
        const newWorker = new WorkerModel({
          name: req.body.name,
          email: req.body.email,
          salary: req.body.salary,
          location: {
            type: "Point",
            coordinates: [req.body.lng, req.body.lat]
          },
          media: req.file.filename,
        });
  
        const savedWorker = await newWorker.save();
  
        // Retrieve updated list of workers with locations
        const workers = await WorkerModel.find().select('name location');
  
        return res.status(201).json({ message: "Worker added successfully", worker: savedWorker, workers });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    });
  };
  