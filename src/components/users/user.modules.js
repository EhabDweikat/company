const{Schema,model}=require('mongoose');
const schema=Schema({
    name:{
        type:String,
        require:[true,'user name is require'],
        trim:true,
        minlength:[2,'too short user name']
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

    password:{
        type:String,
        require:[true,'password is require'],
        minlength:[6,'too short user name'],

    },

    profileImage:{
        type:String,
       
    },

    age: {
        type: Date,
        required: [true, 'age is required'],
        },

    country: {
        type: String,
        required: [true, 'country is required'],
        },

    role:{
        type:String,
        enum:['admin','user'],
    },
    isActive:{
        type:Boolean,
        default:true,

    },


    verified:{
        type:Boolean,
        default:false,
    }

},{timestamps:true});
module.exports=model('user',schema);
