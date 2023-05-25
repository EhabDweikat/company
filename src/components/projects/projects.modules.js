const{Schema,model}=require('mongoose');

const { Task } = require('../WorkerAndTask/Worker.module');

const schema=Schema({
    name:{
        type:String,
        require:[true,'project name is require'],
        trim:true,
        unique:[true,'project name is unique'],
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
        enum: ['pending', 'overdue', 'completed','not start'],
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
        tasks: [{
          type: Schema.Types.ObjectId,
          ref: Task ,
      }]
       
        
        
        
        
},{timestamps:true});
module.exports=model('project',schema);
