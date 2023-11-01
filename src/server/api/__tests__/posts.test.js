const request = require("supertest");

const app = require('../../app')

const prismaMock = require('../../mocks/prismaMock');

const jwt = require('jsonwebtoken');
jest.mock('jsonwebtoken');



describe('/api/posts', () => {
    describe('GET /api/posts', () => {
        it('returns list of all posts', async () => {
            const posts = [
                { id: 1, title: "cats are cool", content: "here are all the cool cats", tags: [{ id: "1", name: "#happy" }, { id: "2", name: "#soCool" }] },
                { id: 2, title: "dogs are cool", content: "here are all the cool dogs", tags: [{ id: "1", name: "#happy" }, { id: "2", name: "#soCool" }] }
            ];

            prismaMock.posts.findMany.mockResolvedValue(posts);

            const response = await request(app).get('/api/posts');

            expect(response.body.posts[0]).toEqual(posts[0]);
            expect(response.body.posts[1]).toEqual(posts[1]);
            expect(prismaMock.posts.findMany).toHaveBeenCalledTimes(1);
        })

        it('should handle an error', async () => {
            const mockErrorMessage = `{"name":"Error","message":"Error occured during get all posts"}`;

            prismaMock.posts.findMany.mockRejectedValue(new Error(mockErrorMessage));

            const response = await request(app).get('/api/posts')

            expect(response._body.message).toEqual(mockErrorMessage);
            expect(prismaMock.posts.findMany).toHaveBeenCalledTimes(1);

        })
    });

    describe('GET /api/posts/:id', () => {
        it('returns a single post', async () => {
            const post = { id: 1, title: "cats are cool", content: "here are all the cool cats", tags: [{ id: "1", name: "#happy" }, { id: "2", name: "#soCool" }] }


            prismaMock.posts.findUnique.mockResolvedValue(post);

            const response = await request(app).get('/api/posts/2');

            expect(response.body.post.id).toEqual(post.id);
            expect(prismaMock.posts.findUnique).toHaveBeenCalledTimes(1);
        })

        it('should handle an error', async () => {
            const mockErrorMessage = `{"name":"Error","message":"Error occured during get single post"}`;

            prismaMock.posts.findUnique.mockRejectedValue(new Error(mockErrorMessage));

            const response = await request(app).get('/api/posts/1')

            expect(response._body.message).toEqual(mockErrorMessage);
            expect(prismaMock.posts.findUnique).toHaveBeenCalledTimes(1);

        })
    })

    describe('POST /api/posts', () => {
        it('successfully creates a new post', async () => {
            const newPost = {
                id: 1,
                title: "Rainy Sunday",
                content: "All the things you can do inside on a sunday",
                tags: [
                    { name: "#rainraingoaway" },
                    { name: "#sundayFunday" }
                ]
            }

             //mock that you are logged in
            const userId = 2
            jwt.verify.mockReturnValue({ id: userId })
            prismaMock.users.findUnique.mockResolvedValue({ id: userId });

            prismaMock.posts.create.mockResolvedValue(newPost);

            const response = await request(app).post('/api/posts').set('Authorization', 'Bearer testToken')

            expect(response.body.id).toEqual(newPost.id);
            expect(response.body.title).toEqual(newPost.title);
            expect(response.body.content).toEqual(newPost.content);
            expect(response.body.tags).toEqual(newPost.tags);

            expect(prismaMock.posts.create).toHaveBeenCalledTimes(1);
        })

        it('should handle an error', async () => {
            const mockErrorMessage = `{"name":"Error","message":"Error occured during creating post"}`;

             //mock that you are logged in
            const userId = 2
            jwt.verify.mockReturnValue({ id: userId })
            prismaMock.users.findUnique.mockResolvedValue({ id: userId });

            prismaMock.posts.create.mockRejectedValue(new Error(mockErrorMessage));

            const response = await request(app).post('/api/posts').set('Authorization', 'Bearer testToken')


            expect(response._body.message).toEqual(mockErrorMessage);
            expect(prismaMock.posts.create).toHaveBeenCalledTimes(1);

        })

        it('should handle if user not logged in', async () => {
            const mockErrorMessage = "You must be logged in to preform this action"

            prismaMock.posts.create.mockRejectedValue(new Error(mockErrorMessage));

            const response = await request(app).post('/api/posts')

            expect(response._body.message).toEqual(mockErrorMessage);
            expect(prismaMock.posts.create).toHaveBeenCalledTimes(1);
        })
    })

    describe('PUT /api/posts/:postId', () => {
        it('successfully updates a post', async () => {
            const updatedPost = {
                id: 1,
                authorId: 2,
                title: "Rainy Sunday",
                content: "All the things you can do inside on a sunday",
                tags: [
                    { name: "#rainraingoaway" },
                    { name: "#sundayFunday" }
                ]
            }

            // const userId = 2
            //mock that you are logged in
            jwt.verify.mockReturnValue({ id: updatedPost.authorId })
            prismaMock.users.findUnique.mockResolvedValue({ id: updatedPost.authorId});
            console.log(updatedPost.id)

            //mock the prisma calls for the put request
            prismaMock.posts.findUnique.mockResolvedValue({ post: updatedPost.id })
            prismaMock.posts.update.mockResolvedValue({ post: updatedPost });

            const response = await request(app).put('/api/posts/1').set('Authorization', 'Bearer testToken')
            console.log(response.body)
            expect(response.body.id).toEqual(updatedPost.id);
            expect(response.body.title).toEqual(updatedPost.title);
            expect(response.body.content).toEqual(updatedPost.content);
            expect(response.body.tags).toEqual(updatedPost.tags);

            expect(prismaMock.posts.update).toHaveBeenCalledTimes(1);

        })

        it('should handle an error', async () => {
            const mockErrorMessage = `{"name":"Error","message":"Error occured during updating post"}`;

             //mock that you are logged in
            const userId = 2
            jwt.verify.mockReturnValue({ id: userId })
            prismaMock.users.findUnique.mockResolvedValue({ id: userId });

            prismaMock.posts.update.mockRejectedValue(new Error(mockErrorMessage));

            const response = await request(app).put('/api/posts/1').set('Authorization', 'Bearer testToken')


            expect(response._body.message).toEqual(mockErrorMessage);
            expect(prismaMock.posts.update).toHaveBeenCalledTimes(1);
        })

        it('should handle user not be logged in', async () => {
            const mockErrorMessage = "You must be logged in to preform this action"

            prismaMock.posts.update.mockRejectedValue(new Error(mockErrorMessage));

            const response = await request(app).put('/api/posts/1')

            expect(response._body.message).toEqual(mockErrorMessage);
            expect(prismaMock.posts.update).toHaveBeenCalledTimes(1);
        })
    })

    describe('DELETE /api/posts/:postId', () => {
        it('successfully deletes a post', async () => {
            const deletedPost = {
                id: 1,
                authorId: 2,
                title: "Rainy Sunday",
                content: "All the things you can do inside on a sunday",
                tags: [
                    { name: "#rainraingoaway" },
                    { name: "#sundayFunday" }
                ]
            }

             //mock that you are logged in
            // const userId = 2
            jwt.verify.mockReturnValue({ id: deletedPost.authorId })
            prismaMock.users.findUnique.mockResolvedValue({ id: deletedPost.authorId });

            prismaMock.posts.findUnique.mockResolvedValue({ post: deletedPost.id })

            prismaMock.posts.delete.mockResolvedValue({ post: deletedPost });

            const response = await request(app).delete('/api/posts/1').set('Authorization', 'Bearer testToken')
            console.log(response.body)
            expect(response.body.id).toEqual(deletedPost.id);
            expect(response.body.title).toEqual(deletedPost.title);
            expect(response.body.content).toEqual(deletedPost.content);
            expect(response.body.tags).toEqual(deletedPost.tags);

            expect(prismaMock.posts.delete).toHaveBeenCalledTimes(1);

        })
        it('should handle an error', async () => {
            const deletedPost = {
                id: 1,
                authorId: 2,
                title: "Rainy Sunday",
                content: "All the things you can do inside on a sunday",
                tags: [
                    { name: "#rainraingoaway" },
                    { name: "#sundayFunday" }
                ]
            }
            const mockErrorMessage = `{"name":"Error","message":"Error occured during deleting post"}`;

            // const deletedPostId =1;
            
            //mock that you are logged in
            const userId = 2
            jwt.verify.mockReturnValue({ id: userId })
            prismaMock.users.findUnique.mockResolvedValue({ id: userId });

            prismaMock.posts.findUnique.mockResolvedValue({ post: deletedPost.id })

            prismaMock.posts.delete.mockRejectedValue(new Error(mockErrorMessage));

            const response = await request(app).delete('/api/posts/1').set('Authorization', 'Bearer testToken')


            expect(response._body.message).toEqual(mockErrorMessage);
            expect(prismaMock.posts.delete).toHaveBeenCalledTimes(1);
        })

        it('should handle the user not be logged in', async () => {
            const mockErrorMessage = "You must be logged in to preform this action"

            prismaMock.posts.delete.mockRejectedValue(new Error(mockErrorMessage));

            const response = await request(app).delete('/api/posts/1')

            expect(response._body.message).toEqual(mockErrorMessage);
            expect(prismaMock.posts.delete).toHaveBeenCalledTimes(1);
        })
    })
})

