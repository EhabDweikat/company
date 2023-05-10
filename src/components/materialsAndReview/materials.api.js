const MaterialServises = require('./materials.services');

const router=require('express').Router();

router.post('/AddMaterial',MaterialServises.AddNewMaterial);
router.post('/AddCategory',MaterialServises.AddCategory);

router.put('/updateMaterial/:id',MaterialServises.UpdateMaterials);
router.delete('/deleteMaterial/:name',MaterialServises.DeleteMaterial);
router.get('/GetAllMaterial',MaterialServises.GetAllMaterials);
router.get('/GetById/:name',MaterialServises.GetSpecificMaterialByid);
router.post('/:id/reviews',MaterialServises.addMaterialReviewController);
router.get('/:id/reviews',MaterialServises.getMaterialReviewsController);
router.get('/Category',MaterialServises.Categorys);
router.get('/:categoryName',MaterialServises.GetMaterialCategory);
router.get('/materialName/:name',MaterialServises.GetMaterialByName);
router.get('/CategoryByName/:name',MaterialServises.GetCategoryByName);
router.put('/Modifided/:materialId/:reviewId',MaterialServises.updateMaterialReview);







module.exports=router;
