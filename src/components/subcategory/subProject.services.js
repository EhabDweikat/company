const SubProject=require('./subProject.modules');
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

//

// Initialize multer upload object
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Max file size 1 MB
    //
}).single('media');

module.exports.AddWorker = async (req, res) => {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: err });
      }
  
      try {
        const existingworker = await SubProject.findOne({ name: req.body.name });
        if (existingworker) {
          return res.status(400).json({ message: "WORKER WITH SAME NAME ALREDY EXISIT", project: existingworker });
        }
  
        const newProject = new SubProject({
                name: req.body.name,
                description: req.body.description,
                staff: req.body.staff,
                company:req.body.company,
                status:req.body.status,
                price:req.body.price,
                materials:req.body.materials,
                media: req.file.filename,
                ProjecctNumber:req.body.ProjecctNumber,
                
        });
  
        const savedworker = await newProject.save();
        return res.status(201).json({ message: " Details Of The Project Added Succsfully ", project: savedworker });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    });
  };

  module.exports.updateDetails = async (req, res) => {
    const name=req.params.name;
    const {company, price,materials,  status } = req.body;

    try {
        const details = await SubProject.findOneAndUpdate(name, { company,price,materials, status }, { new: true });

        if (!details) {
            return res.status(404).json({ message: 'details not found .' });
        }

        res.status(200).json(details);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports.getWorkerbyName = async (req, res) => {
    const name=req.params.name;

    try {
        const project = await SubProject.findOne({ ProjecctNumber: req.params.ProjecctNumber });
        if (!project) {
          return res.status(404).json({ message: "Worker Not found" });
        }
    
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${project.media}`;
    
        return res.status(200).json({ message: "worker found", project: { ...project.toObject(), imageUrl } });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
}

module.exports.deleteWorker = async (req, res) => {
    const name = req.params.name;
  
    try {
      const deletedWorker = await SubProject.findOneAndDelete({ name });
  
      if (!deletedWorker) {
        return res.status(404).json({ message: 'Worker not found.' });
      }
  
      return res.status(200).json({ message: 'Worker deleted successfully.', worker: deletedWorker });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };

  module.exports.GetDetails= async (req,res)=>{
    try{
        const DetailsProject= await SubProject.find({ProjecctNumber: req.params.ProjecctNumber });
        if(!DetailsProject){
            return res.status(404).json({message:'There is no details'})
        }else{
            return res.status(201).json({DetailsProject})
        }
    }catch(error){
        return res.status(500).json({ message: 'Internal server error',error });
    
    }
    }
    