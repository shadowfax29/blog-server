const { validationResult } = require("express-validator");
const Comment = require("../models/comment-model");
const Post = require("../models/post-model")

const commentController = {};

commentController.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const body = req.body
        const comment = {
            content: body.content,
            author: req.user.id,
            post: req.params.postId
        }
        const newComment = await Comment.create(comment)
        await Post.findByIdAndUpdate(req.params.postId, { $push: { comments: newComment } });

        res.json(newComment)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message });
    }
};

commentController.show = async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({ post: postId })
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

commentController.update = async (req, res) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const available = await Post.findOne({ _id: postId })
        if (!available) {
            return res.status(404).json({ message: "post not found" });
        }

        const commentIndex = available.comments.findIndex(comment => comment._id.toString() === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found in the post" });
        }
        // Remove the comment from the post's comments array
        available.comments.splice(commentIndex, 1);
        await available.save();


            
            const updatedComment = await Comment.findByIdAndUpdate(commentId, req.body, { new: true });

            await Post.findByIdAndUpdate(req.params.postId, { $push: { comments: updatedComment } });

            if (!updatedComment) {
                return res.status(404).json({ message: "Comment not found" });
            }
            res.json(updatedComment);
        

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

commentController.delete = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const postId = req.params.postId;

        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Find the comment within the post
        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found in the post" });
        }

        // Remove the comment from the post's comments array
        post.comments.splice(commentIndex, 1);

        // Save the updated post
        await post.save();

        // Delete the comment from the comments collection
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: "Comment not found in the database" });
        }

        // Respond with the deleted comment
        res.json(deletedComment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = commentController;
