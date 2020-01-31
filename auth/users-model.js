const database = require("../database/dbConfig");

module.exports = {
    add,
    find,
    findBy,
    findById,
}

async function add(user) {
    const [id] = await database("users").insert(user)

    return findById(id)
}

function findById(id) {
    return database("users")
        .where({ id })
        .first();
}

function findBy(filter) {
    return database("users")
        .where(filter)
        .first();
}

function find() {
    //this request looked too boring as a one-line return so i compounded it.
    return database("users as u")
        .select("u.*");
}