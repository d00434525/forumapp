// initiate express server
const express = require("express");
const { User, Thread } = require("../persist/model");
const setUpAuth = require("./auth");
const setUpSession = require("./session");
const app = express();

// tell the server to understand how to read json
app.use(express.json());

setUpSession(app);
setUpAuth(app);


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

app.post("/thread", async(req,res) => {
    // auth
    if (!req.user) {
        res.status(401).json({ message: "unauthorized." });
        return;
    }
    // create with await + try/catch
    try {
        let thread = await Thread.create({
            user_id: req.user.id,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
        });
        req.status(201).json(thread);
    } catch (error) {
        res.status(500).json({
            message: "could not create thread",
            error: error,
        });
    }
});

app.get("/thread/:id", async (req,res) => {
    // check authorization
    if (!req.user) {
        res.status(401).json({ message: "unauthorized."});
        return;
    }
    try {
        let thread = await Thread.findById(id);
        req.status(201).json(thread);
    } catch (error) {
        res.status(500).json({
            message: "could not get thread",
            error: error,
        });
    }
})

app.get("/thread", async (req,res) => {
    try {
        let threads = await Thread.find({}, "-posts");
        req.status(201).json(threads);
    } catch (error) {
        res.status(500).json({
            message: "could not get threads",
            error: error,
        });
    }
    // get all users for all the threads
    for (let k in threads) {
        try {
            threads[k] = threads[k].toObject();
            let user = await User.findById(threads[k].user_id);
            threads[k].user = user;
        } catch (error) {
            console.log(
                `unable to get user ${threads[k].user_id} when getting thread ${threads[k]._id}: ${error}`
            );
        }
    }
    res.send(JSON.stringify(threads));
});

app.delete("/thread/:id", async (req,res) => {
    // check authorization.
    if (!req.user){
        res.status(401).json({ message: "unauthorizaed." });
        return;
    }
    try {
        let thread = await Thread.findByIdAndDelete(id);
        req.status(201).json(thread);
    } catch {
        res.status(500).json({
            message: "could not delete thread.",
            error: error,
        });
    }
})

app.post("/post", (req,res) => {})

app.delete("/thread/:thread_id/post/:post_id", (req,res) => {})

module.exports = app;