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
    try{
    let categories=await CategoryModel.find({});
    if (categories.length > 0) {
        return res.status(200).json(categories);
    } else {
        return res.status(404).json({ message: 'No  projects found.' });
    }
}catch(error){
    return res.status(500).json({ message: 'Internal server error',error });
}
}

module.exports.getProjectid=async(req,res)=>{
    const{id}=req.params;
    let category= await CategoryModel.findById(id);
    res.status(200).json(category);

}

module.exports.getPending = async (req, res) => {
    try{
    let pending = await CategoryModel.find({status: 'pending'});

    if (pending.length > 0) {
        return res.status(200).json(pending);
    } else {
        return res.status(404).json({ message: 'No pending projects found.' });
    }
}catch(error){
    return res.status(500).json({ message: 'Internal server error',error });


}
}

module.exports.getOverdue = async (req, res) => {
    try{
    let overdue=await CategoryModel.find({status: 'overdue'});
    if (overdue.length > 0) {
        return res.status(200).json(overdue);
    } else {
        return res.status(404).json({ message: 'No overdue projects found.' });
    }
}catch(error){
    return res.status(500).json({ message: 'Internal server error',error });


}
}



module.exports.getCompleted = async (req, res) => {
    try{
    let completed=await CategoryModel.find({status: 'completed'});
    if (completed.length > 0) {
        return res.status(200).json(completed);
    } else {
        return res.status(404).json({ message: 'No completed projects found.' });
    }
}
    catch(error){
        return res.status(500).json({ message: 'Internal server error',error });
    
    
    }
}

module.exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const { name, description, status } = req.body;

    try {
        const project = await CategoryModel.findByIdAndUpdate(id, { name, description, status }, { new: true });

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};



module.exports.getbyName = async (req, res) => {
    const name=req.params.name;

    try {
        const project = await CategoryModel.findOne({ name: req.params.name });
        if (!project) {
          return res.status(404).json({ message: "Project not found" });
        }
    
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${project.media}`;
    
        return res.status(200).json({ message: "Project found", project: { ...project.toObject(), imageUrl } });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
}


