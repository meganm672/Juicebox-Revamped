const request = require("supertest");

const app = require('../../app');

const prismaMock = require('../../mocks/prismaMock');

describe('GET /api/users', () => {
    
    it('returns list of all users', async () => {
        const users = [
            {id: 1, username: 'catscatscats',name: 'Cat Doe', password:'password', location: "Tampa, Fl"},
            {id: 2, username: 'dogsdogsdogs',name: 'Spike Doe', password:'password', location: "Miami, Fl"}
        ];

        prismaMock.users.findMany.mockResolvedValue({users:users});

        const response = await request(app).get('/api/users');
        console.log(response.body)
        expect(response.body).toEqual(users);
    });

});