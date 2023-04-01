const dataMethod=['body','params','query','headers'];
export const validation =(schema)=>{
    return (req,res,next)=>{
        try{
const validationARR=[];
dataMethod.forEach((key)=>{
    if(schema[key]){
        const validationARRESULT=schema[key].validate(req[key],{abortEarly:false});
        if(validationARRESULT.error){
            validationARR.push(validationARRESULT.error.details);
        }else{
            next();
        }
    }
})
if(validationARR.length){
    return res.status(400).json({message:'validation error',validationARR});
}

  


        }catch(error){
            res.status(500).json({message:'catch error',errro});

        }
    }
} 
