const express = require('express');

const userRouter = require('./users/userRouter.js');
const postRouter = require('./posts/postRouter.js');

const server = express();
const helmet = require('helmet');

//custom middleware
server.use(helmet());
server.use(express.json());


//endpoints
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);
server.get('/', (req, res) => {
  res.send(`<h2>SCOTT's COOL API!</h2>`);
});

module.exports = server;


function logger(req,res,next) {
  console.log(`${req.method} Request to ${req.originalUrl}`)
}
