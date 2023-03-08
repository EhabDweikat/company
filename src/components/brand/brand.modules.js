const{Schema,model}=require('mongoose');
const schema=Schema({
    name:{
        type:String,
        require:[true,'brand name is require'],
        trim:true,
        unique:[true,'brand name is unique'],
        minlength:[2,'too short brand name']
    },
    image:String,
   
},{timestamps:true});
module.exports=model('brand',schema);
