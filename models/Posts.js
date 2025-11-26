const {Schema, model} = require('mongoose');
const slugify = require('slugify');
const postSchema = new Schema({ 
    title: {
        type: String,
        required: true
    },  
    content: {
        type: String,
        required: true
    },
   user:{
        ref: 'User',
        type: Schema.Types.ObjectId,
        required: true
    }

}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    timestamps: true,
    id:false,
})
postSchema.virtual('comments',{
    ref:'Comment',
    localField:'_id',
    foreignField:'post',
    justOne:false  
})
postSchema.pre("save", function (next) {
    if (this.isModified("title") || this.isNew) {
      this.slug = slugify(this.title, { lower: true, strict: true });
    }

    next();
});
const Post = model('Post', postSchema);

module.exports = Post;