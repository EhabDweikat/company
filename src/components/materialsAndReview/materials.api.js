const MaterialServises = require('./materials.services');

const router=require('express').Router();

router.post('/AddMaterial',MaterialServises.AddNewMaterial);
router.put('/updateMaterial/:id',MaterialServises.UpdateMaterials);
router.delete('/deleteMaterial/:name',MaterialServises.DeleteMaterial);
router.get('/GetAllMaterial',MaterialServises.GetAllMaterials);
router.get('/GetById/:id',MaterialServises.GetSpecificMaterialByid);
router.post('/:id/reviews',MaterialServises.makeReview);


module.exports=router;
