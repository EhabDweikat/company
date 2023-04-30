const EquipmentModel=require('./equipment.modules');
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
module.exports.AddEquipment=async (req,res,next)=>{

    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(500).json({ message: err.message });
        } else if (err) {
          return res.status(500).json({ message: err });
        }
  
    
    try{
        const existingEquipment = await EquipmentModel.findOne({ EquipmentNumber: req.body.EquipmentNumber });
        if (existingEquipment) {
          return res.status(400).json({ message: "Equipment with the same name already exists", project: existingEquipment });
        }
        const { name, category, availabilityStatus, location, specifications, maintenanceHistory, notes,EquipmentNumber} = req.body;
    const equipment=new EquipmentModel({
        name:name,
        category:category,
        availabilityStatus:availabilityStatus,
        location:location,
        specifications:specifications,
        maintenanceHistory:maintenanceHistory,
        notes:notes,
      EquipmentNumber:EquipmentNumber,
      equipmentId: new mongoose.Types.ObjectId(), // Generate a new ObjectId for the equipmentId field

    media: req.file.filename,
       
      
      reservations: [],


    });

        const NewEquipment= await equipment.save();
        res.status(201).json({ message: "Equipment created successfully", Equipment: NewEquipment });

    }catch (error) {
        console.error(error);
        next(error);
      }
});
}

module.exports.GetDetails= async (req,res)=>{
try{
    const DetailsEquipment= await EquipmentModel.findById(req.params.id);
    if(!DetailsEquipment){
        return res.status(404).json({message:'There is no Equipment'})
    }else{
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${DetailsEquipment.media}`;
            
        return res.status(201).json({message:'The Specific details Founded',DetailsEquipment:{ ...DetailsEquipment.toObject(), imageUrl }})
    }
}catch(error){
    return res.status(500).json({ message: 'Internal server error',error });

}
}


module.exports.getAllEquipment = async (req,res)=>{
    try{

        const equipment= await EquipmentModel.find();
        if(equipment.length>0){
         return   res.status(200).json(equipment);

        }else {
           return res.status(404).json({message:'There is no Equipment on company'});
        }


    }catch(error){
        return res.status(500).json({ message: 'Internal server error',error });

    }
}



