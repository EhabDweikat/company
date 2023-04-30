const{Schema,model}=require ('mongoose');

const reviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, { timestamps: true });

const materialSchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  media: {
    type: String,
    default: null

  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
},{timestamps:true});

const Material = model('Material', materialSchema);
const Review = model('Review', reviewSchema);

module.exports = {Material,Review};


