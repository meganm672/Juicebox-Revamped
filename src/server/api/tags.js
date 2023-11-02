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

module.exports = tagsRouter;