const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = require('./user')

const FollowSchema = new Schema({
// jo follow kar raha h (follower)
    user:{
        type:Schema.Types.ObjectId,
        ref:'users',
        required:true
    },

    //jo follow ho raha h
    followed_user:{
        type:Schema.Types.ObjectId,
        ref:'users',
        required:true
    }

},{timestamps:true})

FollowSchema.index({ user: 1, followed_user: 1 }, { unique: true });

FollowSchema.post('save', async function (next) {
    try {
        await Promise.all([
            User.updateOne({_id: this.user}, {$inc: {followings: 1}}),
            User.updateOne({_id: this.followed_user}, {$inc: {followers: 1}})
        ])
    } catch (err) {
        console.log(err)
    }
})

FollowSchema.post('remove', async function (next) {
    try {
        await Promise.all([
         User.updateOne({_id: this.user}, {$inc: {followings: -1}}),
         User.updateOne({_id: this.followed_user}, {$inc: {followers: -1}})
        ])
    } catch (err) {
        console.log(err)
    }
})

const Follow = mongoose.model('follows', FollowSchema);
module.exports = Follow ;