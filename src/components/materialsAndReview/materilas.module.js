const{Schema,model}=require ('mongoose');

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: ['Glass', 'Bricks & Construction Aggregates', 'Doors and windows', 'wood plywood','Steel Pipes and Tubes','Plastic Pipes','Cement and Concrete','Wash Basins','Building & Construction Machines','Cranes','Real Estate Developer','ForkLift & Lifting Machines','Holder & Hardware Fittings','Earth Moving Machinary','Roofing and False ceiling','Elevators &Escaltors','Gate Grilles,Fences&Railings','Scaffolding Pipes and Fittings','Steel Bars'] // Add your categories here
  },
  media: {
    type: String,
    default: null
  }
});


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
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
}, {timestamps: true});

const Material = model('Material', materialSchema);
const Review = model('Review', reviewSchema);
const Category = model('Category', categorySchema);

module.exports = {Material, Review, Category};


