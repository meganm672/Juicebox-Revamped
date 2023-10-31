const request = require("supertest");

const app = require('../../app')

const prismaMock = require('../../mocks/prismaMock');

const jwt = require('jsonwebtoken');
jest.mock('jsonwebtoken');



describe('/api/posts', () =>{
    describe('GET /api/posts', () =>{
        it('returns list of all posts', async () =>{
            const posts = [
                {id: 1, title: "cats are cool", content: "here are all the cool cats", tags:[ {id:"1",name: "#happy"},{id:"2",name:"#soCool"}]},
                {id: 2, title: "dogs are cool", content: "here are all the cool dogs", tags:[ {id:"1",name: "#happy"},{id:"2",name:"#soCool"}]}
            ];

            prismaMock.posts.findMany.mockResolvedValue(posts);

            const response = await request(app).get('/api/posts');
        
            expect(response.body.posts[0]).toEqual(posts[0]);
            expect(response.body.posts[1]).toEqual(posts[1]);
        })
    })

    describe('POST /api/posts', ()=>{
        it('successfully creates a new listing', async () =>{
            const newPost={
                id:1,
                title: "Rainy Sunday",
                content: "All the things you can do inside on a sunday",
                tags: [
                    {name: "#rainraingoaway"},
                    {name: "#sundayFunday"}
                ]
            }

            const userId= 2
            jwt.verify.mockReturnValue({id: userId})
            prismaMock.users.findUnique.mockResolvedValue({id:userId});

            prismaMock.posts.create.mockResolvedValue(newPost);

            const response = await  request(app).post('/api/posts').set('Authorization','Bearer testToken')

            expect(response.body.id).toEqual(newPost.id);
            expect(response.body.title).toEqual(newPost.title);
            expect(response.body.content).toEqual(newPost.content);
            expect(response.body.tags).toEqual(newPost.tags);

            expect(prismaMock.posts.create).toHaveBeenCalledTimes(1);

        })
    })
})

//test update 