const express = require("express");
const bcrypt = require("bcryptjs");

const Users = require("./users-model.js");
const restricted = require("../auth/restricted-middleware.js");

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

router.post("/login", (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                res.status(200).json({
                    message: `Logged in!`
                });
            } else {
                res.status(401).json({ message: `Invalid Credentials` });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.get("/users", restricted, (req, res) => {
    Users.find()
        .then(users => res.status(200).json(users))
        .catch(error => res.status(500).json({ error }));
});

router.delete("/logout", restricted, (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                res.status(400).send("Unable to logout...");
            } else {
                res.send("Buh Bye!");
            }
        })
    } else {
        res.end();
    }
})

// function validate(req, res, next) {
//     let { username, password } = req.headers;
//     if (username && password) {
//         Users.findBy({ username })
//             .first()
//             .then(user => {
//                 if (user && bcrypt.compareSync(password, user.password)) {
//                     next();
//                 } else {
//                     res.status(401).json({ message: "You shall not pass!" });
//                 }
//             })
//             .catch(error => res.status(500).json({ error }));
//     } else {
//         res.status(401).json({ message: "Invalid credentials!" });
//     }
// }

module.exports = router;
