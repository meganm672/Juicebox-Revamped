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
    });
    describe('GET /api/users', () => {
        it('returns list of all users', async () => {
            const users = [
                { id: 1, username: 'catscatscats', name: 'Cat Doe', password: 'password', location: "Tampa, Fl" },
                { id: 2, username: 'dogsdogsdogs', name: 'Spike Doe', password: 'password', location: "Miami, Fl" }
            ];

            prismaMock.users.findMany.mockResolvedValue(users);
       

            const response = await request(app).get('/api/users');
            console.log(response.body)
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
                id:"2",
                ...newUser,
            }
            const token="123ghejghurea";
            const hashedPassword="somehashedpassword";

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
                email: 'testemail@testing.com'
            }
            const newUser = {
                email: 'testemail@testing.com',
                password: "testpassword"
            }

            prismaMock.users.findUnique.mockResolvedValue(existingUser);

            const response = await request(app).post('/api/users/register').send(newUser);

            // expect(response.status).toBe(403);
            expect(response.body.name).toBe('UserExistsError');

            expect(prismaMock.users.findUnique).toHaveBeenCalledTimes(1);
            

            // ensure none of the other register code has run
            expect(prismaMock.users.create).toHaveBeenCalledTimes(0);
            expect(bcrypt.hash).toHaveBeenCalledTimes(0);
            expect(jwt.sign).toHaveBeenCalledTimes(0);
        });

        it('does not create a user if the email is missing', async() => {
            const newUser = {
                password: "testpassword"
            }

            const response = await request(app).post('/api/users/register').send(newUser);

            expect(response.status).toEqual(500);
            expect(response.body.name).toEqual('UserCreationError');

            expect(prismaMock.users.create).toHaveBeenCalledTimes(0);
            expect(bcrypt.hash).toHaveBeenCalledTimes(0);
            expect(jwt.sign).toHaveBeenCalledTimes(0);
        });

        it('does not create a user if the password is missing', async() => {
            const newUser = {
                email: "testemail@test.com"
            }

            const response = await request(app).post('/auth/register').send(newUser);

            expect(response.status).toEqual(500);
            expect(response.body.name).toEqual("MissingCredentials");

            expect(prismaMock.user.create).toHaveBeenCalledTimes(0);
            expect(bcrypt.hash).toHaveBeenCalledTimes(0);
            expect(jwt.sign).toHaveBeenCalledTimes(0);
        });
    });

    describe('POST /users/login', () =>{
        it('logs in a user', async () =>{
            const registeredUser= {
                id:"2",
                username: "candyPumpkin",
                name: "Buffy",
                password: "password"
            }

            prismaMock.users.findUnique.mockResolvedValue({user: registeredUser});

            const response = await request(app).post('/api/users/login')
            console.log(response.body)

            expect(response.body.username).toEqual(registeredUser.username)
        })
    })
});