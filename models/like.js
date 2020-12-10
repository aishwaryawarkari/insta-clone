const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = require('./post')

const LikeSchema = new Schema({
    post:{
        type: Schema.Types.ObjectId,
        required:true,
        ref:'posts'
    },
    user:{
        type: Schema.Types.ObjectId,
        required:true,
        ref:'users'
    }
},{timestamps:true})

LikeSchema.index({ post: 1, user: 1 }, { unique: true });

LikeSchema.post('save', async function (next) {
    try {
        await Post.updateOne({_id: this.post}, {$inc: {like_count: 1}})
    } catch (err) {
        console.log(err)
    }
})

LikeSchema.post('remove', async function (next) {
    try {
        await Post.updateOne({_id: this.post}, {$inc: {like_count: -1}})
    } catch (err) {
        console.log(err)
    }
})

const Like = mongoose.model('likes', LikeSchema);
module.exports = Like;