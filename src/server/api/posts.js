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
    const { title, content, tags,  } = req.body;
  
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
            // {authorId:{
            //     equals: req.user.id
            // }}
        ]
        },
        data:{
            title: title,
            content: content,
            tags: tags
        },
        include: {tags: true}
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

module.exports = postsRouter;