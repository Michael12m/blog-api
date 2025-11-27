const pagination =async(querypage,Model)=>{
const page=Math.max(1, parseInt(querypage) || 1);
const limit =20;
const skip=(page-1)*limit;
const posts=await Model.find().skip(skip).limit(limit);
const count=await Model.estimatedDocumentCount();
const totalPages=Math.ceil(count/limit);
const isNext=totalPages>=(page+1);
return {posts, page, totalPages, isNext,count};
}
module.exports={pagination};