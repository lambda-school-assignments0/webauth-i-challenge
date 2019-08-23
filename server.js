const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const UsersRouter = require("./users/users-router.js");

const server = express();

const sessionOptions = {
    name: "authPractice",
    secret: "secretagentmantheyvetakenyournameandgivenyouanumber",
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,

    store: new knexSessionStore({
        knex: require("./data/dbConfig.js"),
        tablename: "sessions",
        sidfieldname: "sid",
        createtable: true,
        clearInterval: 1000 * 60 * 60
    })
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionOptions));

server.use("/api", UsersRouter);

server.get("/", (req, res) => {
    res.send("Server is running successfully.");
});

module.exports = server;
