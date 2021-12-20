const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comments");
const { text } = require("express");

router.put("/:id/comment", async (req, res) => {
  try {
    await new Comment({
      senderId: req.body.userId,
      postId: req.params.id,
      text: req.body.comment,
    }).save();
    res.status(200).send(true);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/:id/getComment", async (req, res) => {
  try {
    const comments = await Comment.find({postId :req.params.id});
    res.status(200).send(comments)
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id/fetchUser" , async(req,res)=>{
  try{
    const user = await User.findById(req.params.id)
    user.password = null
    res.status(200).send(user)
  }catch(err){
    console.log(err)
  }
})

module.exports = router;
