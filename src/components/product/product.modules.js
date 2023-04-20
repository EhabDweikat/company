const{Schema,model}=require('mongoose');
const schema=Schema({
    company: {
        type: String, required: true 
            },

  staff:{
  type: String,
  enum: ['Worker', 'Engineering', 'Contractor'],
  required: true

},
  
  price: {
     type: Number, required: true 
    },
  materials: [{ type: String }],
    
},{timestamps:true});
module.exports=model('AddDetails',schema);
