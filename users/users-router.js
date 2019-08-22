const express = require("express");
const bcrypt = require("bcryptjs");

const Users = require("./users-model.js");

const router = express.Router();

router.post("/register", (req, res) => {
    let user = req.body;

    if (user.username && user.password) {
        const hash = bcrypt.hashSync(user.password, 10);
        user.password = hash;

        Users.add(user)
            .then(
                res.status(201).json({ message: `Welcome ${user.username}!` })
            )
            .catch(error => res.status(500).json({ error }));
    } else {
        res.status(400).json({
            message: "Please provide both a username and password."
        });
    }
});

router.post("/login", validate, (req, res) => {    
    res.status(200).json({ message: "Logged in!" });
});

router.get("/users", validate, (req, res) => {
    Users.find()
        .then(users => res.status(200).json(users))
        .catch(error => res.status(500).json({ error }));
});

function validate(req, res, next) {
    let { username, password } = req.headers;
    if (username && password) {
        Users.findBy({ username })
            .first()
            .then(user => {
                if (user && bcrypt.compareSync(password, user.password)) {
                    next();
                } else {
                    res.status(401).json({ message: "You shall not pass!" });
                }
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        res.status(401).json({ message: "Invalid credentials!" });
    }
}

module.exports = router;
