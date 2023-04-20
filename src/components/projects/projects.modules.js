
const{Schema,model}=require('mongoose');

const schema=Schema({
    name:{
        type:String,
        require:[true,'category name is require'],
        trim:true,
        unique:[true,'category name is unique'],
        minlength:[2,'too short category name']
    },
    media:{
        type: String,
        default: null
} ,
    

    
      description: {
        type: String,
         require:[true,'project description  is require'],
         minlength:[2,'too short project description ']
      },
      status: {
        type: String,
        enum: ['pending', 'overdue', 'completed'],
        required: true
      },
      createdAt: {
         type: Date, 
         default: Date.now 
        },
      updatedAt: {
         type: Date, 
         default: Date.now 
        },
        
        
},{timestamps:true});
module.exports=model('project',schema);
