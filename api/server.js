const express = require('express')
const Posts = require('../data/db.js')
const postsRouter = require('../posts/post-routes.js')

const server = express();
server.use(express.json())


server.get('/', (req, res) => {
    res.status(200).json({hello: "Hello world!"})
})

server.use('/api/posts', postsRouter);

module.exports = server;