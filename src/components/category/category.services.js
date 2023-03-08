const CategoryModel=require('./category.api');

module.exports.creatCategory=async(req,res)=>{
const{name}=req.body;
let category=new CategoryModel({name});
await category.save();
res.status(201).json(category);
}

module.exports.getCategories=async(req,res)=>{
    let categories=CategoryModel.find({});
    res.status(200).json(categories);
}

module.exports.getCategory=async(req,res)=>{
    const{id}=req.params;
    let category=CategoryModel.findById(id);
    res.status(200).json(category)

}