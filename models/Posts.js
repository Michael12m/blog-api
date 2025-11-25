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

}, {timestamps: true})
postSchema.pre("save", function (next) {
    if (this.isModified("title") || this.isNew) {
      this.slug = slugify(this.title, { lower: true, strict: true });
    }

    next();
});
const Post = model('Post', postSchema);

module.exports = Post;