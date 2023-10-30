const express = require('express');
const postsRouter = express.Router();
const prisma = require("../../../client")
const { requireUser } = require('./utils');

const {
    createPost,
    updatePost,
    getPostById,
  } = require('../db');

postsRouter.get('/', async (req, res, next) => {

    try {
      const posts = await prisma.posts.findMany({
        where:{
            OR:[
                {active: true},
                {authorId: req.user.id}
            ],
        },
        include: {tags: true}
      });

      res.send({
        posts
      });
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

  postsRouter.get('/:id', async (req,res,next) =>{
    try{
        const postById = await prisma.posts.findUnique({
            where:{
                id: Number(req.params.id)
            },
            include: {tags:true}
        });
        res.send({postById})
    }catch({ name, message }){
        next({ name, message });
    }
  })
  
  postsRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content = "", tags } = req.body;
  
    const postData = {};
  
    try {
      postData.authorId = req.user.id;
      postData.title = title;
      postData.content = content;
      postData.tags = tags;
  
      const post = await createPost(postData);
  
      if (post) {
        res.send(post);
      } else {
        next({
          name: 'PostCreationError',
          message: 'There was an error creating your post. Please try again.'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });


postsRouter.put('/:postId', requireUser, async (req, res, next) => {
    const { postId } = req.params;
    const { title, content, tags } = req.body;
  
    // const updateFields = {};
  
    // if (tags && tags.length > 0) {
    //   updateFields.tags = tags.trim().split(/\s+/);
    // }
  
    // if (title) {
    //   updateFields.title = title;
    // }
  
    // if (content) {
    //   updateFields.content = content;
    // }
    
  
    try {
      const originalPost = await prisma.posts.update({
        where:{
            AND:[
                {id: Number(postId)},
            {authorId:{
                equals: req.user.id,
            }}
        ]
        },
        data:{
            title: title,
            content: content,
            tags:{
                updateMany:{
                    where:{
                        id: tags.id
                    },
                    data:{name: tags}
                }
            }
        },
        include: {tags: true, author:true}
      });
  
      if (originalPost.authorId !== req.user.id) {
        next({
            name: 'UnauthorizedUserError',
            message: 'You cannot update a post that is not yours'
          })
      } else {
        res.send({ post: originalPost })
      }
    res.send({originalPost})
    } catch ({ name, message }) {
      next({ name, message });
    }
  });


postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
    try {
      const { postId } = req.params;
      const postToUpdate = await getPostById(postId);
      
      if (!postToUpdate) {
        next({
          name: "NotFound",
          message: `No post by ID ${postId}`
        })
      } else if (req.user.id !== postToUpdate.author.id) {
        res.status(403);
        next({
          name: "WrongUserError",
          message: "You must be the same user who created this post to perform this action"
        });
      } else {
        const deletedPost = await prisma.posts.delete({
            where:{
                id: postId
            }
          })
        res.send({ success: true, ...deletedPost });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });
  

module.exports = postsRouter;