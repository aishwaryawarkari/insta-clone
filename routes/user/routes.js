const router = require('express').Router();
const userController = require('./user.controller');
const userAuthenticate = require('../../middleware/auth')
const upload = require('../../middleware/multer')

router.use(userAuthenticate.isAuthenticated)

router.get('/:id', userController.getUser)
router.get('/:id/posts', userController.getUserPosts)
router.put('/profile-pic', upload.single('avatar'), userController.updateProfilePic)
router.post('/:id/follow', userController.followUser)
router.post('/:id/unfollow',userController.unFollowUser)
router.get('/:id/followers', userController.getFollowers)
router.get('/:id/followings', userController.getFollowings)

module.exports = router;