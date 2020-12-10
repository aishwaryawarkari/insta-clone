const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./user')

const postSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    type: {
      type: String,
      enum: ["TEXT", "IMAGE", "VIDEO"],
      required: true,
    },
    caption: { type: String },
    url: { type: String },
    like_count:{ 
      type: Number,
      default:0,
      
    }
  },
  { timestamps: true }
);

postSchema.post('save', async function (next) {
  try {
      await User.updateOne({_id: this.user}, {$inc: {post_count: 1}})
     
  } catch (err) {
      console.log(err)
  }
})

postSchema.post('remove', async function (next) {
  try {
    await User.updateOne({_id: this.user}, {$inc: {post_count: -1}})
  } catch (err) {
      console.log(err)
  }
})

const Post = mongoose.model("posts", postSchema);

module.exports = Post;
