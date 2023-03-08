
const{Schema,model}=require('mongoose');

const schema=Schema({
    name:{
        type:String,
        require:[true,'category name is require'],
        trim:true,
        unique:[true,'category name is unique'],
        minlength:[2,'too short category name']
    },
    image:String,
    Slug:{
        type:String,
        lowercase:true
    }
},{timestamps:true});
module.exports=model('category',schema);
