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
        minlength:[6,'too short password'],

    },

    confirmPassword: {
        type: String,
        require: [true, 'confirm password is required'],
        validate: {
            validator: function (v) {
                return v === this.password;
            },
            message: 'Confirm password must match password',
        },
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
        default:'user'
    },
    isActive:{
        type:Boolean,
        default:true,

    },


    verified:{
        type:Boolean,
        default:false,
    },
    verificationCode: {
        type: String,
       
      },

    balance: {
        type: Number,
        required: true,
      },
     

},{timestamps:true});
module.exports=model('user',schema);
