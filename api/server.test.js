const request = require("supertest");

const server = require("./server");

const database = require("../database/dbConfig");

describe("API", () => {

    describe("testing environment", () => {
        it("Runs in the proper ENV", () => {
            expect(process.env.DB_ENV).toBe("testing")
        })
    })

    describe("register", () => {
        // Clear the users table before each test so you don't cause more headache than necessary.
        beforeEach(async () => {
            await database("users").truncate()
        });

        it("Register returns an error if we pass it something stupid.", () => {
            return request(server)
                .post("/api/auth/register")
                .send({ schmoo: "gru" })
                .then((response) => {
                    // console.log("TESTING RESPONSE IS", response)
                    expect(response.status)
                        .toBe(500)
                    expect(response.type)
                        .toMatch("text/html")
                })
        })
        it("Lets us register an account (if it doesn't exist already.)", () => {
            return request(server)
                .post("/api/auth/register")
                .send({
                    username: "moomer",
                    password: "moo"
                })
                .then((response) => {
                    expect(response.status)
                        .toBe(200)
                    expect(response.type)
                        .toMatch(/json/i)
                })
        })
    })

    describe("login", () => {
        // Clear the users table before each test AND add a valid user for this test.
        // It's a bit artificial, but... isn't that the point?
        beforeEach(async () => {
            await database("users").truncate()
            await request(server)
                .post("/api/auth/register")
                .send({
                    username: "sheldon",
                    password: "bazinga"
                })
        });
        it("Rejects our login request if we send something stupid", () => {
            return request(server)
                .post("/api/auth/login")
                .send({
                    username: "asldjfhlkshjk;rjqr2wj4;",
                    password: "askjldhrlke54jhkl;1324j5lk4123j"
                })
                .then((response) => {
                    expect(response.status)
                        .toBe(401)
                    expect(response.type)
                        .toMatch(/json/i)
                })
        })
        it("Logs us in if what we put in is correct....... duh....", () => {
            return request(server)
                .post("/api/auth/login")
                .send({
                    username: "sheldon",
                    password: "bazinga"
                })
                .then((response) => {
                    expect(response.status)
                        .toBe(200)
                    expect(response.body.message)
                        .toBe("Welcome, sheldon")
                })
        })
    })

})