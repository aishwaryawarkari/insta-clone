const Post = require("../../models/post");
const User = require("../../models/user");
const Like = require("../../models/like");
const postValidator = require("./post.validator");
const fs = require("fs")
const path = require('path');

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 }).populate("user");
    return res.json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    // return console.log(req.file)
    const { caption } = await postValidator
      .createPost()
      .validateAsync(req.body);

    let type;
    let url;
    if(req.file){
      url = `/uploads/${req.file.filename}`
      if(req.file.mimetype.includes('image')){
        type = 'IMAGE'
      }else if(req.file.mimetype.includes('video')){
        type = 'VIDEO'
      }else{
        return next('not a valid media')
      }
    }else{
      if(caption){
        type = 'TEXT'
      }else{
        return next('something is missing')
      }
    }

   

    const user = await User.findById(req.user._id)

    const post = await Post.create({
      user: req.user._id,
      type: type,
      caption: caption,
      url: url
    });

    post.user = user

    return res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { caption } = req.body;

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { caption },
      { new: true }
    );

    return res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
   const post = await Post.findOne({ _id: req.params.id });
   if(!post) return next('post not found');

   if(post.user.toString() !== req.user._id) return next('not authorized');
    if(post.url){
      const filePath = path.resolve(__dirname.replace('\\routes\\post',''), `public${post.url}`);
      fs.unlink(filePath,function(err){
        if(err) return console.log(err);
        console.log('file deleted successfully');
      }); 
    }
   await post.remove();

    return res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

exports.likePost = async (req, res, next) => {
  try {
        const postId = req.params.id;
        const userId = req.user._id;

     const like =  await Like.create({
          post:postId,
          user:userId
        })

        return res.json({success:true, data:like})
  } catch (error) {
      next(error);
  }
}

exports.unlikePost = async (req, res, next) => {
  try {
        const postId = req.params.id;
        const userId = req.user._id;

        const unlike =  await Like.findOne({
          post:postId,
          user:userId
        })

        if(!unlike) return next('post not liked')

        await unlike.remove();

        return res.json({success:true, data:unlike})
  } catch (error) {
      next(error);
  }
}

console.log()