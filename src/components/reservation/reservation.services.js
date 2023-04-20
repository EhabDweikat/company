const ReservationModule=require('./reservation.modules');
const EquipmentModel=require('../equpiment/equipment.modules');

module.exports.Reservation = async (req, res) => {
    const { equipmentID, userID, startTime, endTime } = req.body;
  
    try {
      const equipment = await EquipmentModel.findById(equipmentID);
      if (!equipment) {
        return res.status(404).json({ message: 'Equipment not found' });
      }
  
      const existingReservation = equipment.reservations.id(userID);
      if (existingReservation) {
        return res.status(400).json({ message: 'Equipment is already booked by this user' });
      }
  
      const newReservation = new ReservationModule({
        userID: userID,
        startTime: startTime,
        endTime: endTime,
      });
  
      equipment.reservations.push(newReservation);
  
      await equipment.save();
      res.status(200).json({ message: 'Equipment reserved successfully', Reservation: newReservation });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error });
    }
  };
  

module.exports.cancelReservation = async (req, res) => {
    const { equipmentId, reservationId } = req.params;
  
    try {
      const equipment = await EquipmentModel.findById(equipmentId);
      if (!equipment) {
        return res.status(404).json({ message: 'Equipment not found' });
      }
  
      const reservationIndex = equipment.reservations.findIndex(reservation => reservation._id.toString() === reservationId);
      if (reservationIndex === -1) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
  
      equipment.reservations.splice(reservationIndex, 1);
      await equipment.save();
      res.status(200).json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error });
    }
  };