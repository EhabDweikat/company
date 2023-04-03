const path = require('path');
const multer = require('multer');
const CategoryModel=require('./projects.modules');

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
module.exports.creatNewproject = async (req, res) => {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: err });
      }
  
      try {
        const existingProject = await CategoryModel.findOne({ name: req.body.name });
        if (existingProject) {
          return res.status(400).json({ message: "Project with the same name already exists", project: existingProject });
        }
  
        const newProject = new CategoryModel({
            name: req.body.name,
          description: req.body.description,
          status: req.body.status,
          media: req.file.filename,
        });
  
        const savedProject = await newProject.save();
        return res.status(201).json({ message: "Project created successfully", project: savedProject });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    });
  };
  
module.exports.getAllProjects=async(req,res)=>{
    let categories=await CategoryModel.find({});
    res.status(200).json(categories);
}

module.exports.getProjectid=async(req,res)=>{
    const{id}=req.params;
    let category= await CategoryModel.findById(id);
    res.status(200).json(category);

}

module.exports.getPending=async(req,res)=>{
    let pending=await CategoryModel.find({status: 'pending'});
    res.status(200).json(pending);
}

module.exports.getoverdue=async(req,res)=>{
    let pending=await CategoryModel.find({status: 'overdue'});
    res.status(200).json(pending);
}

module.exports.getcompleted=async(req,res)=>{
    let completed=await CategoryModel.find({status: 'completed'});
    res.status(200).json(completed);
}
