import { Schema,model,Types } from "mongoose";
const schema=Schema({
    name:{
        Type:String,
        require:[true,'subcategory name is require'],
        trim:true,
        unique:[true,'subcategory name is unique'],
        minlength:[2,'too short subcategory name']
    },
   
    Slug:{
        Type:String,
        lowercase:true,
    },
    category:{
        type:Types.ObjectId,
        ref:'category'
    }
});
module.exports=model('subcategory',schema);
