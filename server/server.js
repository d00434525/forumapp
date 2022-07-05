// initiate express server
const express = require("express");
const { User } = require("../persist/model");
const setUpAuth = require("./auth");
const setUpSession = require("./session");
const app = express();

// tell the server to understand how to read json
app.use(express.json());

setUpAuth(app);
setUpSession(app);

// allow serving of UI code
app.use(express.static(`${__dirname}/../public/`));

app.post("/users", async (req,res) => {
    try {
        let user = await User.create({
            username: req.body.username,
            fullname: req.body.fullname,
            password: req.body.password,
        });
        res.status(201).json(user);
    } catch {
        res.status(500).json({
            message: `post request failed to create user`,
            error: error,
        });
    }
});

app.post("/thread", (req,res) => {})

app.get("/thread/:id", (req,res) => {})

app.get("/thread", (req,res) => {})

app.delete("/thread/:id", (req,res) => {})

app.post("/post", (req,res) => {})

app.delete("/thread/:thread_id/post/:post_id", (req,res) => {})

module.exports = app;