const mongoose = require('mongoose')

const User = require('../../models/user')
const Post = require('../../models/post')
const Follow = require('../../models/follow')



exports.getUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const loggedInUserId = req.user._id.toString();

        const user = await User.findById(userId)
        if(!user){
            return next('not a valid user')
        }
        
        if(userId != loggedInUserId){
          const follow = await Follow.findOne({ 
                user: loggedInUserId,
                followed_user: userId
            })

            const isFollowing = follow ? true : false;
            return  res.render('profile' , {loggedInUser:req.user, user, isFollowing})
        }


        res.render('profile' , {loggedInUser:req.user, user})
    } catch (error) {
        next(error);
    }
}

exports.getUserPosts = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const posts = await Post.aggregate([
            {
                $match: {
                    user: mongoose.Types.ObjectId(userId)
                },
            },
            {$sort: {createdAt:-1}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {$unwind: '$user'},
            {
                $lookup: {
                    from: "likes",
                     let: { userId: mongoose.Types.ObjectId(req.user._id), postId: "$_id" },
                     pipeline: [
                        { $match:
                           { $expr:
                              { $and:
                                 [
                                   { $eq: [ "$user",  "$$userId" ] },
                                   { $eq: [ "$post", "$$postId" ] }
                                 ]
                              }
                           }
                        }
                     ],
                     as: "liked"
                }
            },
        ]);
        
        res.json({success:true, data: posts})
    } catch (error) {
        next(error);
    }
}

exports.updateProfilePic = async (req, res, next) => {
    try {
        if(!req.file){
            return next('image not selected');
        }
        const profile_pic = `/uploads/${req.file.filename}`;
        const user = await User.findByIdAndUpdate(req.user._id, {profile_pic}, {new: true})
        res.json({success:true, data:user});
    } catch (error) {
        next(error);
    }
}

exports.followUser = async (req, res, next) => {
    try {
        const follow = await Follow.create({
            user: req.user._id,
            followed_user:req.params.id
        })
        res.json({success:true, data:follow});

    } catch (error) {
        next(error);
    }
}

exports.unFollowUser = async (req, res, next) => {
    try {
        const follow = await Follow.findOne({ 
            user: req.user._id,
            followed_user:req.params.id
        })
        if(!follow) return next('not followed')
        await follow.remove();
        res.json({success:true, data:follow});
    } catch (error) {
        next(error);
    }
}

exports.getFollowers = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const loggedInUserId = req.user._id.toString();

      const followers = await  Follow.find({followed_user:userId}).populate('user', 'name profile_pic')
        res.json({success:true, data:followers})
    } catch (error) {
        next(error);
    }
}

exports.getFollowings = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const loggedInUserId = req.user._id.toString();

        const followings = await Follow.find({user:userId}).populate('followed_user', {name:1,profile_pic:1})
        res.json({success:true, data:followings})

    } catch (error) {
        next(error);
    }
}