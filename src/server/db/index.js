

const prisma = require("../../../client")
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;
/**
 * USER Methods
 */

async function createUser({
    username,
    password,
    name,
    location
}) {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
    try {
        const user = await prisma.users.create({
            data: {
                username: username,
                password: hashedPassword,
                name: name,
                location: location
            }
        });

        return user;
    } catch (error) {
        throw error;
    }
}

async function updateUser(id, fields = {}) {
    

    try {
        const user = await prisma.user.update({
            where: { id: `${id}` },
            data: fields,
            
    });
        return user;
    } catch (error) {
        throw error;
    }
}

async function getAllUsers() {
    try {
        const allUsers = await prisma.users.findMany();

        allUsers.forEach(user => delete user.password);

        return allUsers;
    } catch (error) {
        throw error;
    }
}

async function getUserById(userId) {
    try {
        const user = await prisma.user.findUnique({
            where:{
                id: `${userId}`
            }
        });

        if (!user) {
            throw {
                name: "UserNotFoundError",
                message: "A user with that id does not exist"
            }
        }

        user.posts = await getPostsByUser(userId);

        return user;
    } catch (error) {
        throw error;
    }
}

async function getUserByUsername({username,password}) {
    if(!username || !password){
        return;
    }
    try {
        const user= await prisma.users.findUnique({
            where:{
                username: `${username}`
            }
        })
     
        if (!user) {
            return;
        }
        const hashedPassword= user.password;

        const passwordsMatch= await bcrypt.compare(password,hashedPassword);

        if(!passwordsMatch) return;

        delete user.password; 

        return user;
    } catch (error) {
        throw error;
    }
}

async function getNullableUserByUsername(username) {
    try {
      const user = await prisma.users.findUnique({
        where:{
            username: `${username}`
        }
    })
  
      if (!user) {
        return null;
      }
  
      return user;
    } catch (error) {
      throw error;
    }
  }

/**
 * POST Methods
 */

async function createPost({
    authorId,
    title,
    content,
    tags = []
}) {
    try {
        const post = await prisma.posts.create({
            data:{
                authorId: authorId,
                title: title,
                content: content,
                tags:{
                    create: tags
                }
            },
            include: {tags: true}
        });

     
        return post;
     
    } catch (error) {
        throw error;
    }
}

async function updatePost(postId, fields = {}) {
    // read off the tags & remove that field 
    const { tags } = fields; // might be undefined
    delete fields.tags;

    // build the set string
    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

    try {
        // update any fields that need to be updated
    //     if (setString.length > 0) {
    //         await client.query(`
    //     UPDATE posts
    //     SET ${setString}
    //     WHERE id=${postId}
    //     RETURNING *;
    //   `, Object.values(fields));
    //     }

        // return early if there's no tags to update
        if (tags === undefined) {
            return await getPostById(postId);
        }

        // make any new tags that need to be made
        const tagList = await createTags(tags);
        const tagListIdString = tagList.map(
            tag => `${tag.id}`
        ).join(', ');

        // delete any post_tags from the database which aren't in that tagList
    //     await client.query(`
    //   DELETE FROM post_tags
    //   WHERE "tagId"
    //   NOT IN (${tagListIdString})
    //   AND "postId"=$1;
    // `, [postId]);

        // and create post_tags as necessary
        await addTagsToPost(postId, tagList);

        return await getPostById(postId);
    } catch (error) {
        throw error;
    }
}



async function getPostById(postId) {
    try {
        const post = await prisma.posts.findUnique({
            where:{
                id: postId
            },
            include: {tags: true, author: true}
        });

        if (!post) {
            throw {
                name: "PostNotFoundError",
                message: "Could not find a post with that postId"
            };
        }
       
        delete post.author.password;

        return post;
    } catch (error) {
        throw error;
    }
}

async function getPostsByUser(userId) {
    try {
        const  postIds = await prisma.posts.findMany({
            where:{
                authorId: `${userId}`
            }
        });

        const posts = await Promise.all(postIds.map(
            post => getPostById(post.id)
        ));

        return posts;
    } catch (error) {
        throw error;
    }
}

async function getPostsByTagName(tagName) {
    try {
        const postIds  = await prisma.posts.findUnique({
            where:{
                tags: tagName
            }
        });

        return await Promise.all(postIds.map(
            post => getPostById(post.id)
        ));
    } catch (error) {
        throw error;
    }
}

/**
 * TAG Methods
 */




async function getAllTags() {
    try {
        const tags = await prisma.tags.findMany();

        return tags
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
    getUserByUsername,
    getNullableUserByUsername,
    getPostById,
    createPost,
    updatePost,
    getPostsByUser,
    getPostsByTagName,
    getAllTags,
}