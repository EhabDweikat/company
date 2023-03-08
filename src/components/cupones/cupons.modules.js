const{Schema,model}=require('mongoose');
const schema=Schema({
    code:{
        type:String,
        require:[true,'Copun name is require'],
        trim:true,
        unique:[true,'Copun name is unique'],
        
    },
   disCount:{
         type:Number,

   },

   expires:{
    type:Date,
   }
   
},{timestamps:true});
module.exports=model('cupons',schema);
