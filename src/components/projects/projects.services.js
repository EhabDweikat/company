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
module.exports.creatNewproject=async(req, res)=> {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            return res.status(500).json({ message: err.message });
        } else if (err) {
            // An unknown error occurred when uploading
            return res.status(500).json({ message: err });
        }

        // Everything went fine, save the new project
        const newProject = new CategoryModel({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            media: req.file.filename, // Save the filename of the uploaded image
            //createdAt: new Date(),
            //updatedAt: new Date()
        });

        newProject.save()
            
            .catch((err) => {
                res.status(500).json({ message: err.message });
            });
    });
}

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
