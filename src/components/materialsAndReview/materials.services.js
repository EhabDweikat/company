const path = require('path');
const multer = require('multer');

//const materialsModule=require('./materilas.module');
const { Material, Review,Category } = require('./materilas.module');




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


module.exports.Categorys = async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0){
      return res.status(404).json({message:'There are no categories found'});
    } else {
      const categoriesWithImageUrls = categories.map(category => {
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${category.media}`;

        return {
          name: category.name,
          imageUrl: imageUrl
        }
      });
      return res.status(200).json({ message: 'Categories found', categories: categoriesWithImageUrls });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports.GetMaterialCategory = async (req, res) => {
  const { categoryName } = req.params;
  try {
    const category = await Category.findOne({ name: categoryName });
    if (!category){
      return res.status(404).json({message:'There is no category founded'});
    }else{
      const materials = await Material.find({ category: category._id });
      const materialsWithImageUrls = materials.map(material => {
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${material.media}`;
        return {
          ...material.toObject(),
          imageUrl
        };
      });
      return res.status(200).json({message:'The Materials belonging to the category are found', materials: materialsWithImageUrls});
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}



// Function to create a new materila
module.exports.AddNewMaterial = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: err });
    }

    try {
      const existingMaterial = await Material.findOne({ name: req.body.name });
      if (existingMaterial) {
        return res.status(400).json({ message: "Material with the same name already exists", Material: existingMaterial });
      }

      const category = await Category.findOne({ name: req.body.categoryName });
      if (!category) {
        return res.status(400).json({ message: "Category not found" });
      }

      const newMaterial = new Material({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          stock: req.body.stock,
          unit:req.body.unit,
          media:req.file.filename,
          category: category._id, // Add the category ID to the material object
          reviews: [],
      });

      const savedMaterial = await newMaterial.save();
      return res.status(201).json({ message: "Material Add to its specific category successfully", Material: savedMaterial });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });
};


module.exports.AddCategory = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: err });
    }

    try {
      const existingCategory = await Category.findOne({ name: req.body.name });
      if (existingCategory) {
        return res.status(400).json({ message: "Category with the same name already exists", Categoryies: existingCategory });
      }

      const newCategory = new Category({
          name: req.body.name,
          media:req.file.filename,

      });

      const savedCategory = await newCategory.save();
      return res.status(201).json({ message: " category Add  successfully", categories: savedCategory });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });
};


module.exports.GetMaterialByName = async (req, res) => {
  const { name } = req.params;
  try {
    const material = await Material.findOne({ name });
    if (!material){
      return res.status(404).json({message:'No material found with that name'});
    }else{
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${material.media}`;
    
      return res.status(200).json({message:'Material found',material:{ ...material.toObject(), imageUrl }})
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports.GetCategoryByName = async (req, res) => {
  const { name } = req.params;
  try {
    const OneCategory = await Category.findOne({ name });
    if (!OneCategory){
      return res.status(404).json({message:'No Category found with that name'});
    }else{
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${OneCategory.media}`;
    
      return res.status(200).json({message:'Category found',OneCategory:{ ...OneCategory.toObject(), imageUrl }})
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}


