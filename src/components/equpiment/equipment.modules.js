const{Schema,model}=require ('mongoose');
const schema=Schema({
    name: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      availabilityStatus: {
        type: String,
        required: true
      },
      location: {
        type: String,
        required: true
      },
      specifications: {
        type: String,
        required: true
      },
      maintenanceHistory: {
        type: String,
        required: true
      },
      notes: {
        type: String,
        required: true
      },
      EquipmentNumber:{
        type:Number,
        require:true
        
      },

      equipmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Equipment',
        required: true,
      },
      
      reservations: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
          startTime: {
            type: Date,
            required: true,
          },
          endTime: {
            type: Date,
            required: true,
          },
        },
      ],

      media:{
        type: String,
        default: null
} ,

   
},{timestamps:true});
module.exports=model('equipment',schema);