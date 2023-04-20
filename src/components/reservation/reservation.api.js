const ReservationConroller=require('./reservation.services');
const router=require('express').Router();
 
router.post('/ReservationNew',ReservationConroller.Reservation);




module.exports=router;