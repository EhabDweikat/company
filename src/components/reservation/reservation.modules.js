const{Schema,model}=require('mongoose');
const schema=Schema({
    equipmentID: {
        type: Schema.Types.ObjectId,
        ref: 'Equipment',
        required: true
      },
      userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      startTime: {
        type: Date,
        required: true
      },
      endTime: {
        type: Date,
        required: true
      }
   
},{timestamps:true});
module.exports=model('Resarvation',schema);
