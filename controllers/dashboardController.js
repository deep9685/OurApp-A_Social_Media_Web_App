const UserPost = require("../models/Post");
const User = require("../models/User");

async function handleUserDashboard(req, res){
    try{
        const user = req.user;

       // Find the logged-in user and populate the following field
      const loggedUser = await User.findById(user._id).populate('following','_id');

      if (!loggedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const followedUserIds = loggedUser.following.map(user => user._id);

      // fetch the latest posts from followed users
      const posts = await UserPost.find({user: { $in: followedUserIds}})
                                  .sort({createdAt: -1})
                                  .limit(20);

      return res.render("home-dashboard.ejs", {user, posts});
    }catch(error) {
        return res.redirect("/", {
            error: "Incorrect Email or Password",
        });
    }
};

async function handleGetCreatePost(req, res) {
    res.render("create-post.ejs", {
        user: req.user,
    });
};

async function handleCreatePost(req, res){
    const {title, body} = req.body;

    // console.log(req.body);

    const post = await UserPost.create({
        title:title,
        content: body,
        user: req.user._id,
    });

    return res.redirect(`/dashboard/${post._id}`);
};


async function handleGetProfile(req, res){
    try{
        const profileUser = await User.findById(req.params.id);

        const currentUserId = req.user._id;
        // console.log(profileUser)
        const userPosts = await UserPost.find({user: profileUser._id})
                                        .sort({createdAt: -1});

        const userWithFollowers = await User.findById(profileUser._id)
      .populate('followers', 'userName')
      .populate('following', 'userName');


        // const otherUser = 1;
        if (!profileUser) {
            return res.status(404).send('User not found');
        }
        
        res.render("profile",{
            user:profileUser,
            otherUser: profileUser._id.toString() === currentUserId.toString(),
            userName:profileUser.userName,
            userPosts,
            followers: userWithFollowers.followers,
            following: userWithFollowers.following,
            // currentUser: req.user // assuming req.user is the logged-in user
        });
    }catch (error) {
        console.error('Error finding user', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
};


async function handleGetSinglePostScreen(req, res){
    const post = await UserPost.findById(req.params.id);

     if (!post) {
        return res.status(404).send('Post not found');
      }

     const user = await User.findById(post.user);

     const currentUser = req.user;

     res.render("single-post-screen",{
        user:user,
        post,
        isPostOwner: post.user._id.toString() === currentUser._id.toString(),
     });
};

async function handleDeleteSinglePostScreen(req, res) {
    try {
        const postId = req.params.id;
        
        // Find the post by ID and delete it
        const deletedPost = await UserPost.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Return success response
        return res.status(200).json({ message: 'Post deleted successfully' });
        // return res.redirect('/dashboard/profile');
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function handleGetEditPost(req, res) {
    const post = await UserPost.findById(req.params.id);

    res.render("edit-post", {
        post,
    });
};

async function handlePostEditPost(req, res){
    try {
        const postId = req.params.id;
        const { title, body } = req.body;
    
        // Find the post by ID and update its title and body
        const updatedPost = await UserPost.findByIdAndUpdate(postId, { title, content: body }, { new: true });
    
        if (!updatedPost) {
          return res.status(404).json({ error: 'Post not found' });
        }
    
        // Redirect to the route with the post ID
      return res.redirect(`/dashboard/${updatedPost._id}`);
      } catch (error) {
        console.error('Error updating post:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
};


async function handleIsFollowing(req, res){
    try {
        const currentUserId = req.user._id;
        const profileUserId = req.params.id;

        const currentUser = await User.findById(currentUserId);
        
        if (!currentUser) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        const isFollowing = currentUser.following.includes(profileUserId);
        return res.status(200).json({ isFollowing });
    } catch (error) {
        console.error('Error checking follow status:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

async function handleUserFollow(req, res){
    try{
        const currentUserId = req.user._id;  // Assuming you have the current user's ID from session or JWT
        const userToFollowId = req.params.userId;

        // Find the current user and the user to follow
        const currentUser = await User.findById(currentUserId);
        const userToFollow = await User.findById(userToFollowId);

        // console.log(currentUser);
        // console.log(userToFollow);

        if (!userToFollow) {
            return res.status(404).json({ error: 'User to follow not found' });
        }

        // Avoid duplicate follow
        if (!currentUser.following.includes(userToFollowId)) {
            currentUser.following.push(userToFollowId);
        }

        if (!userToFollow.followers.includes(currentUserId)) {
            userToFollow.followers.push(currentUserId);
        }

       // Save both users
       const savedCurrentUser = await currentUser.save();
       const savedUserToFollow = await userToFollow.save();


        return res.status(200).json({ success: true });
    }catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
};

async function handleUserUnfollow(req, res){
    try {
        const currentUserId = req.user._id;
        const userToUnfollowId = req.params.userId;

        // console.log('Current User ID:', currentUserId);
        // console.log('User To Unfollow ID:', userToUnfollowId);

        const currentUser = await User.findById(currentUserId);
        const userToUnfollow = await User.findById(userToUnfollowId);

        // console.log('Current User:', currentUser);
        // console.log('User To Unfollow:', userToUnfollow);

        if (!currentUser || !userToUnfollow) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add logging to check the values of currentUser and userToUnfollow

        currentUser.following = currentUser.following.filter(id => id.toString() !== userToUnfollowId);
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUserId);

        await currentUser.save();
        await userToUnfollow.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
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
    handleUserUnfollow,
}