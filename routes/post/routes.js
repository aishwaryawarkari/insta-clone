const router = require("express").Router();
const postController = require("./post.controller");
const {isAuthenticated} = require("../../middleware/auth");
const upload = require('../../middleware/multer')

router.use(isAuthenticated)

router.get("/", postController.getPosts);
router.post("/",upload.single('avatar'), postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);
router.post("/:id/like", postController.likePost);
router.post("/:id/unlike", postController.unlikePost)

module.exports = router;

// GET {{URL}}/posts
// GET {{URL}}/posts/1
// POST {{URL}}/posts
//     body {
//         ...
//     }
// PUT {{URL}}/posts/1
//     body {
//         ...
//     }
// DELETE {{URL}}/posts/1
