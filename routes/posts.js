const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comments")

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/:id/delete", async (req, res) => {
  try {
    const post = await Post.findOne({ userId: req.params.id });
    console.log(post.userId);
    console.log(req.body.userId);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      console.log("hello");
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("Post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.post("/search", (req, res) => {
  User.find(
    { username: { $regex: req.body.searchItem, $options: "i" } },
    (err, allUsers) => {
      if (err) {
        console.log(err);
      } else {
        res.send(allUsers);
      }
    }
  );
});
router.post("/show", async (req, res) => {
  let likeUsers = [];
  try {
    const post = await Post.findOne({ _id: req.body.showItem });
    for (let i = 0; i < post.likes.length; i++) {
      const user = await User.findById(post.likes[i]);
      if (user !== null) {
        likeUsers.push(user);
      }
    }
    res.status(200).json(likeUsers);
  } catch (err) {
    console.log(err);
    res.status(500).send("database error");
  }
});

module.exports = router;
