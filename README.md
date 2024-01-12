# Improved Juicebox

For this project, I recreated the Juicebox SQL API from scratch with Prisma. Fully Operational CRUD API that uses Express.JS and Prisma to create a Tumblr-like website for blogging and networking

## Technologies Used
* HTML 
* Javascript
* Prisma
* Node
* Jest Test
* PostgreSQL

## Installation

Getting Started

1. Clone your repository locally
2. Run `npm install` to install all the dependencies
3. Setup your `.env` file locally to include `JWT_SECRET`
4. Run `npm run dev` to run locally

### Initialize the Database
Run the following command lines to add prisma and initialize the database:
```
npm inti -y
```
```
npm install prisma --save-dev
```
```
npx prisma migrate dev --name init
```

### Seed the Database

This will run the `server/db/seed.js` file:
```
npm run seed
```

### Starting the App

To just run the build + server, run:
```
npm run dev
```

## How to Run the App

To just run the build + server, run:
`npm run dev`

