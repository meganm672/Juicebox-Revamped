const express = require('express');
const usersRouter = express.Router();

const prisma = require("../../../client");

const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env

const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

usersRouter.get('/', async (req, res, next) => {
    try {
        const users = await prisma.users.findMany();

        users.forEach(user => delete user.password);
      
        res.send(users);
    } catch ({ name, message }) {
        next({ name, message });
    }
});

usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    // request must have both
    if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        });
    }

    try {
        const user = await prisma.users.findUnique({
            where:{
                username: `${username}`
            }
        });

        if (!user) {
            next({
              name: 'IncorrectCredentialsError',
              message: 'Username or password is incorrect'
            });
          } else {
            const hashedPassword= user.password;

            const passwordsMatch= await bcrypt.compare(password,hashedPassword);
    
            if(!passwordsMatch) return;
    
            const token = jwt.sign({
                id: user.id,
                username
            }, JWT_SECRET, {
                expiresIn: '1w'
            });
            delete user.password;

            res.send({
                user,
                message: "you're logged in!",
                token
            });
        } 
    } catch (error) {
        console.log(error);
        next(error);
    }
});

usersRouter.post('/register', async (req, res, next) => {
    const { username, password, name, location } = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
    try {
        const _user = await prisma.users.findUnique({
            where:{
                username: username
            }
        });

        if (_user) {
            next({
                name: 'UserExistsError',
                message: 'A user by that username already exists'
            });
        }

        const user = await prisma.users.create({
            data: {
                username: username,
                password: hashedPassword,
                name: name,
                location: location
            }
        });

        if(!user){
            next({
                name: 'UserCreationError',
                message: 'There was a problem registering. Please try again.',
              });
        } else{
        delete user.password;

        const token = jwt.sign({
            id: user.id,
            username
        }, JWT_SECRET, {
            expiresIn: '1w'
        });

        res.send({
            user,
            message: "thank you for signing up",
            token
        });
    }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

module.exports = usersRouter;