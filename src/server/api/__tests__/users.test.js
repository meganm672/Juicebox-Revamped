const request = require("supertest");

const app = require('../../app');

const prismaMock = require('../../mocks/prismaMock');

const bcrypt = require('bcrypt')
jest.mock('bcrypt')

const jwt = require('jsonwebtoken');
jest.mock('jsonwebtoken');

describe('/api/users', () => {
    beforeEach(() => {
        jwt.sign.mockReset();
        bcrypt.hash.mockReset();
        bcrypt.compare.mockReset();
    });
    describe('GET /api/users', () => {
        it('returns list of all users', async () => {
            const users = [
                { id: 1, username: 'catscatscats', name: 'Cat Doe', password: 'password', location: "Tampa, Fl" },
                { id: 2, username: 'dogsdogsdogs', name: 'Spike Doe', password: 'password', location: "Miami, Fl" }
            ];

            prismaMock.users.findMany.mockResolvedValue(users);

            const response = await request(app).get('/api/users');
    
            expect(response.body).toEqual(users);
        });
    });

    describe('POST /users/register', () => {
        it('creates a new user and a token', async () => {
            const newUser = {
                username: "candyPumpkin",
                name: "Buffy",
                password: "password",
                location: "Tampa, FL"
            }
            const createdUser = {
                id: "2",
                ...newUser,
            }
            const token = "123ghejghurea";
            const hashedPassword = "somehashedpassword";

            bcrypt.hash.mockResolvedValue(hashedPassword)
            // prismaMock.users.findUnique.mockResolvedValue({id: newUser.id})

            prismaMock.users.create.mockResolvedValue(createdUser);
            jwt.sign.mockReturnValue(token)

            const response = await request(app).post('/api/users/register').send(createdUser);

            expect(response.body.user.username).toEqual(createdUser.username)
            expect(response.body.user.id).toEqual(createdUser.id)

            // token was sent in the response
            expect(response.body.token).toEqual(token);

            // NO password was sent in the reponse
            expect(response.body.user.password).toBeUndefined();

            expect(bcrypt.hash).toHaveBeenCalledTimes(1);

            expect(prismaMock.users.create).toHaveBeenCalledTimes(1);

        })
        it('does not create a user if user with that email already exists', async () => {
            const existingUser = {
                username: 'testemail@testing.com'
            }
            const newUser = {
                username: 'testemail@testing.com',
                password: "testpassword"
            }

            prismaMock.users.findUnique.mockResolvedValue(existingUser);

            const response = await request(app).post('/api/users/register').send(newUser);

            expect(response.status).toBe(403);
            expect(response.body.name).toBe('UserExistsError');

            expect(prismaMock.users.findUnique).toHaveBeenCalledTimes(1);
            expect(prismaMock.users.findUnique).toHaveBeenCalledWith({
                where: { username: newUser.username }
            })

            // ensure none of the other register code has run
            expect(prismaMock.users.create).toHaveBeenCalledTimes(0);
            expect(jwt.sign).toHaveBeenCalledTimes(0);
        });

        it('does not create a user if the email is missing', async () => {
            const newUser = {
                password: "testpassword"
            }

            const response = await request(app).post('/api/users/register').send(newUser);

            expect(response.status).toEqual(500);
            expect(response.body.name).toEqual('UserCreationError');

            expect(jwt.sign).toHaveBeenCalledTimes(0);
        });

        it('does not create a user if the password is missing', async () => {
            const newUser = {
                email: "testemail@test.com"
            }

            const response = await request(app).post('/api/users/register').send(newUser);

            expect(response.status).toEqual(500);
            expect(response.body.name).toEqual('UserCreationError');

            expect(prismaMock.user.create).toHaveBeenCalledTimes(0);

            expect(jwt.sign).toHaveBeenCalledTimes(0);
        });
    });

    describe('POST /users/login', () => {

        it('successfully logs in a token and returns a token for valid email and password', async () => {
            const loggedInUser = {
                username: "candyPumpkin",
                password: "password"
            }
            // mock prisma.user.findUnique returns a user
            prismaMock.users.findUnique.mockResolvedValue(loggedInUser);
            const hashedPassword = "somehashedpassword";
            const token = "testtoken";
            // mock that bcrypt.compare succeeded
            bcrypt.compare.mockResolvedValue(loggedInUser.password, hashedPassword)
            // mock that jwt.sign returns the token
            jwt.sign.mockReturnValue(token)
            // test that the user and token are returned
            const response = await request(app).post('/api/users/login').send(loggedInUser);

            expect(response.body.user.username).toEqual(loggedInUser.username)

            // token was sent in the response
            expect(response.body.token).toEqual(token);

            // NO password was sent in the reponse
            expect(response.body.user.password).toBeUndefined();

            expect(bcrypt.compare).toHaveBeenCalledTimes(1);

            expect(prismaMock.users.findUnique).toHaveBeenCalledTimes(1);

        });

        it('does not log in user if the email is missing', async () => {
            const newUser = {
                password: "testpassword"
            }

            const response = await request(app).post('/api/users/login').send(newUser);

            expect(response.status).toEqual(500);
            expect(response.body.name).toEqual("MissingCredentialsError");

            expect(prismaMock.users.findUnique).toHaveBeenCalledTimes(0);

            expect(jwt.sign).toHaveBeenCalledTimes(0);
        });

        it('does not log in the user if the password is missing', async () => {
            const newUser = {
                email: "testemail@test.com"
            }

            const response = await request(app).post('/api/users/login').send(newUser);

            expect(response.status).toEqual(500);
            expect(response.body.name).toEqual("MissingCredentialsError");

            expect(prismaMock.users.findUnique).toHaveBeenCalledTimes(0);

            expect(jwt.sign).toHaveBeenCalledTimes(0);
        });

    });

});