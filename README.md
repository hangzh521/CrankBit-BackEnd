# AllGood Backend

## Description

This is a Node.js application using Express.js. It features a RESTful API and is written in TypeScript. Key features include user authentication with JWTs, MongoDB with Mongoose for data storage, and email services using Nodemailer.

The application follows common security best practices, using packages like Helmet for setting HTTP headers, express-rate-limit for rate limiting, and bcrypt for password hashing. API documentation is handled with Swagger.

## Prerequisites

Ensure you have Node.js version `18.0.0` or later.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install the dependencies.

```
npm install
```

## Usage

To run the app in development mode, use one of the following commands:

```
npm run dev
npm run start
```

To run the app in production mode with Node.js, use:

```
npm run start:node
```

To run the app in production mode with PM2, use:

```
npm run start:pm2
```

To build the application for production, use:

```
npm run build
```

## Testing

To run tests, use:

```
npm run test
```

## Linting

The project uses ESLint and Prettier for code formatting and consistency. You can manually lint the code using the following command:

```
npm run lint
```

## Built With

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/) / [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [Helmet](https://helmetjs.github.io/)
- [Husky](https://typicode.github.io/husky/#/)
- [Nodemailer](https://nodemailer.com/about/)
