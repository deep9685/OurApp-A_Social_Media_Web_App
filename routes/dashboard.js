const {Router} = require("express");


const router = Router();
// const path = require("path");

const {
    handleUserDashboard,
    handleGetCreatePost,
    handleCreatePost,
    handleGetProfile,
    handleGetSinglePostScreen,
    handleDeleteSinglePostScreen,
    handleGetEditPost,
    handlePostEditPost,
    handleIsFollowing,
    handleUserFollow,
    handleUserUnfollow
} = require("../controllers/dashboardController");


router.get('/', handleUserDashboard);

router.route("/create-post").get(handleGetCreatePost).post(handleCreatePost);

router.get('/profile/:id', handleGetProfile);

router.route('/:id').get(handleGetSinglePostScreen).delete(handleDeleteSinglePostScreen);

router.route('/edit-post/:id').get(handleGetEditPost).post(handlePostEditPost);

router.get('/is-following/:id', handleIsFollowing);

router.post('/follow/:userId', handleUserFollow);

router.post('/unfollow/:userId', handleUserUnfollow);

module.exports = router;