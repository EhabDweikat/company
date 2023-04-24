const{Schema,model}=require('mongoose');

const schema = Schema({
  name: {
    type: String,
    required: true,
  },
  email:{
    type:String,
    require:[true,'email is require'],
    unique:[true,'email must be  unique'],
    trim:true,

},

phone:{
    type:String,
    require:[true,'phone is require'],
},
  salary: {
    type: Number,
    required: true,
  },
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },

  media:{
    type:String,
    default: null,
}
  
},{timestamps:true});

module.exports = model('Worker', schema);