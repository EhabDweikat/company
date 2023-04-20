const EquipmentServises=require('./equipment.servises');
const router=require('express').Router();

router.get('/GetEquipment',EquipmentServises.getAllEquipment);
router.post('/AddEquipment',EquipmentServises.AddEquipment);
router.get('/GetDetails/:id',EquipmentServises.GetDetails);


module.exports=router;


