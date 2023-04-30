const path = require('path');
const multer = require('multer');
//const materialsModule=require('./materilas.module');
const { Material, Review } = require('./materilas.module');



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

// Function to create a new project
module.exports.AddNewMaterial = async (req, res) => {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: err });
      }
  
      try {
        const existingMaterials = await Material.findOne({ name: req.body.name });
        if (existingMaterials) {
          return res.status(400).json({ message: "Material with the same name already exists", Material: existingMaterials });
        }
  
        const newMaterial = new Material({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            unit:req.body.unit,
            media:req.file.filename,
            reviews: [],

        });
  
        const savedMaterial = await newMaterial.save();
        return res.status(201).json({ message: "Material Add successfully", Material: savedMaterial });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    });
  };


module.exports.GetAllMaterials=async(req,res)=>{
    try{
        const ShowMaterial=await Material.find({});
        if(ShowMaterial.length>0){
            return res.status(201).json({message:'The materials Founded',ShowMaterial});
        }else{
            return res.status(404).json({message:'There is No Materials Founded '})
        }
    }catch(error){
        return res.status(500).json({ message: 'Internal server error',error });
    }
}

module.exports.GetSpecificMaterialByid=async(req,res)=>{
    try{

        const SpecificMaterial=await Material.findById(req.params.id).populate('reviews');
        if (!SpecificMaterial){
            return res.status(404).json({message:'The Specific Materials Not  Founded'});
        }else{
            const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${SpecificMaterial.media}`;

            return res.status(201).json({message:'The Specific Materials Founded',SpecificMaterial:{ ...SpecificMaterial.toObject(), imageUrl }})
        }

    }catch(error){
        return res.status(500).json({ message: 'Internal server error',error });
    }
}

module.exports.UpdateMaterials= async (req,res)=>{
    try {
        const material = await Material.findByIdAndUpdate(req.params.id);
        if (!material) {
          return res.status(404).json({ message: 'Material not found' });
        }else{

            material.price = req.body.price || material.price;
        material.stock = req.body.stock || material.stock;

        const updatedMaterial = await material.save();
        res.status(200).json({ message: 'Material updated', material: updatedMaterial });
        }
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    
}

module.exports.DeleteMaterial = async (req, res) => {
    const name = req.params.name;
  
    try {
      
      const deletedMaterial = await Material.findOneAndDelete({ name });
  
      if (!deletedMaterial) {
        return res.status(404).json({ message: 'Materila not found.' });
      }
  
      return res.status(200).json({ message: 'Materila deleted successfully.', Material: deletedMaterial });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };


  // Function to add a review to a material
module.exports.addMaterialReviews = async (materialId, userId, rating, comment) => {
  try {
    const material = await Material.findById(materialId);
    if (!material) {
      throw new Error('Material not found');
    }

    const review = new Review({ user: userId, rating, comment });
    await review.save();

    material.reviews.push(review);
    await material.save();

    return review;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Controller function to add a review to a material
module.exports.makeReview = async (req, res) => {
  const { id } = req.params;
  const { userId, rating, comment } = req.body;

  try {
    const review = await this.addMaterialReviews(id, userId, rating, comment);
    res.status(201).json({ review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


