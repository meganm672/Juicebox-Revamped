const express = require('express');
const prisma = require('../../../client');
const tagsRouter = express.Router();


tagsRouter.get('/', async (req, res, next) => {
    try {
      const tags = await prisma.tags.findMany();
    
      res.send({
        tags
      });
    } catch ({ name, message }) {
      next({ name, message });
    }
  });
  // not sure i need this
  tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    let { tagName } = req.params;
    
    // decode %23happy to #happy
    tagName = decodeURIComponent(tagName)
  
    try {
      const allPosts = await prisma.posts.findMany({
        where:{
            tags: tagName
        }
      });
  
      const posts = allPosts.filter(post => {
        if (post.active) {
          return true;
        }
  
        if (req.user && req.user.id === post.authorId) {
          return true;
        }
  
        return false;
      })
  
      res.send({ posts });
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

module.exports = tagsRouter;