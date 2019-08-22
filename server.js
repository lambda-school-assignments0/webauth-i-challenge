const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const server = express();

const UsersRouter = require("./users/users-router.js");

server.use(helmet());
server.use(express.json());
server.use(cors());
// server.use('api/restricted', UsersRouter);

server.get("/", (req, res) => {
    res.send("Server is running successfully.");
});

module.exports = server;