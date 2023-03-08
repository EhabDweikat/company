const{Schema,model}=require('mongoose');
const schema=Schema({
    name:{
        type:String,
        require:[true,'product name is require'],
        trim:true,//delete spaces
        unique:[true,'product name is unique'],
        minlength:[2,'too short product name'],
    },
    image:String,
    Slug:{
        type:String,
        lowercase:true,
    },
    describtion:{
        type:String,
        require:[true,'product name is require'],
        trim:true,
        minlength:[10,'too short product name'],
    },
    quantity:{
       type:Number,
       require:[true,'product name is require'],
       default:0,
    },
    colors:[String],
    price:{
        type:Number,
       require:[true,'product price  is require'],
    },

    priceAfterDiscount:{
        type:Number,
        require:[true,'product priceAfterDiscount  is require'],
    },

    imageCover:String,
    images:[String],

    category:{
        type:Types.ObjectId,
        ref:'category',
        require:[true,'product category  is require'],

    },

    subcategory:{
        type:Types.ObjectId,
        ref:'subcategory',
        require:[true,'product subcategory  is require'],

    },
    brand:{
        type:Types.ObjectId,
        ref:'brand',
        require:[true,'product brand  is require'],
    },

    ratingAvg:{
        type:Number,
        min:[1,'reating average must be greater than 1'],
        max:[5,'reating average must be less than 5']
    },

    ratingCount:{
        type:Number,
        default:0,
    },

    soldCount:{ //كم مرة تم بيع المنتج
        type:Number,
        default:0,
        require:[true,'product sold  is require'],

    }

    
},{timestamps:true});
module.exports=model('product',schema);
