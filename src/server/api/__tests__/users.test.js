const request = require("supertest");

const app = require('../../app');

const prismaMock = require('../../mocks/prismaMock');

const bcrypt = require('bcrypt')
jest.mock('bcrypt')

const jwt = require('jsonwebtoken');
jest.mock('jsonwebtoken');

describe('/api/users', () => {
    describe('GET /api/users', () => {
        it('returns list of all users', async () => {
            const users = [
                { id: 1, username: 'catscatscats', name: 'Cat Doe', password: 'password', location: "Tampa, Fl" },
                { id: 2, username: 'dogsdogsdogs', name: 'Spike Doe', password: 'password', location: "Miami, Fl" }
            ];

            prismaMock.users.findMany.mockResolvedValue({ users: users });

            const response = await request(app).get('/api/users');
            console.log(response.body)
            expect(response.body).toEqual(users);
        });
    });

    describe('POST /users/register', () => {
        it('creates a new user', async () => {
            const newUser = {
                id:"2",
                username: "candyPumpkin",
                name: "Buffy",
                password: "password",
                location: "Tampa, FL"
            }

            jwt.verify.mockReturnValue({ id: newUser.id })
            prismaMock.users.findUnique.mockResolvedValue({id: newUser.id})

            prismaMock.users.create.mockResolvedValue({ user: newUser });

            const response = await request(app).post('/api/users/register').set('Authorization', 'Bearer testToken');
            console.log(response.body.user.user)
            expect(response.body.user.user.username).toEqual(newUser.username)
            expect(response.body.user.user.password).not.toBe(newUser.password)
            expect(await bcrypt.compare(response.body.user.user.password, newUser.password)).toBe(true);
        })
    });

    describe('POST /users/login', () =>{
        it('logs in a user', async () =>{
            const registeredUser= {
                id:"2",
                username: "candyPumpkin",
                name: "Buffy"
            }

            prismaMock.users.findUnique.mockResolvedValue({user: registeredUser});

            const response = await request(app).post('/api/users/login')
            console.log(response.body)

            expect(response.body.username).toEqual(registeredUser.username)
        })
    })
});