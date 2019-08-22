const db = require("../data/dbConfig.js");

function add(user) {
    return db
        .from("users")
        .insert(user);
}

function find() {
    return db
        .select("id", "username", "password")
        .from("users");
}

function findBy(filter) {
    return db
        .select("*")
        .from("users")
        .where(filter);
}

module.exports = {
    add,
    find,
    findBy
};
