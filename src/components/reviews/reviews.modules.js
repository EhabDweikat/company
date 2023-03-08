const{Schema,model}=require('mongoose');
const schema=Schema({
    title:{
        type:String,
        require:[true,'brand name is require'],
        trim:true,
        minlength:[2,'too short brand name']
    },
    user:{
        type:Types.ObjectId,
        ref:'user',
    },

    product:{
        type:Types.ObjectId,
        ref:'product',
        require:[true,'product category  is require'],

    },

    ratingAvg:{
        type:Number,
        min:[1,'reating average must be greater than 1'],
        max:[5,'reating average must be less than 5']
    },

   
},{timestamps:true});
module.exports=model('reviews',schema);