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
        res.status(201).json(thread);
    } catch (error) {
        res.status(500).json({
            message: "could not create thread",
            error: error,
        });
    }
});

app.get("/thread/:id", async (req,res) => {
    let thread
    try {
        const id = req.params.id;
        thread = await Thread.findById(id);
        // res.status(201).json(thread);
    } catch (error) {
        res.status(500).json({
            message: "could not get thread",
            error: error,
        });
        return;
    }
    try {
        thread = thread.toObject();
        let user = await User.findById(thread.user_id);
        thread.user = user;
    } catch (error){
        console.log(
           error // `unable to get user ${thread.user_id} when getting thread ${thread._id}: ${error}`
        )
    }
    res.status(201).json(thread);
})

app.get("/thread", async (req,res) => {
    try {
        var threads = await Thread.find({}, "-posts");
        // res.status(201).json(threads);
    } catch (error) {
        res.status(500).json({
            message: "could not get threads",
            error: error,
        });
        return;
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
    // res.send(JSON.stringify(threads));
    res.status(201).json(threads);
});

app.delete("/thread/:id", async (req,res) => {
    // check authorization.
    if (!req.user) {
        res.status(401).json({ message: "unauthorized." });
        return;
    }
    // pull thread
    let thread;
    try {
        const id = req.params.id;
        thread = await Thread.findById(id);
    } catch (error){
        res.status(500).json({
            message: "failed to delete thread",
            error: error,
        });
        return;
    }

    // check if thread is found
    if (thread === null){
        res.status(404).json({
            message: `thread not found`,
            thread_id: req.params.thread_id,
        });
        return;
    }

    // check that the thread is "owned" by the requesting user
    if (thread.user_id != req.user.id){
        res.status(403).json({ message: "you are not authorized to delete this thread." });
        return;
    }
    // delete the post
    try {
        await Thread.findByIdAndDelete(req.params.id);
    } catch (error) {
        res.status(500).json({
            message: "failed to delete post.",
            error: error,
        });
        return;
    }
    // return 
    res.status(200).json({
        message: "succesfully deleted thread."
    });
    


    // delete the thread

    // return the selected thread
})

app.post("/post", async (req,res) => {
    // check auth
    if (!req.user) {
        res.status(401).json({ message: "unauthorized." });
        return;
    }
    // find the thread and update it with the new post
    let thread;
    try {
        thread = await Thread.findByIdAndUpdate(
            req.body.thread_id,
            {
                $push: {
                    posts: {
                        // what fields are we pushing and what are we pushing?
                        user_id: req.body.user_id,
                        body: req.body.body,
                        thread_id: req.body.thread_id,
                    },
                },
            },
            {
                new: true,
            }
        );
        if (!thread) {
            res.status(400).json({
                message: `thread not found`,
                id: req.body.thread_id,
            });
            return;
        }
    } catch (error) {
        res.status(500).json({
            message: "failed to insert post",
            error: error,
        });
        return;
    }

    // return the post
    res.status(201).json(thread.posts[thread.posts.length -1]);
});

app.delete("/thread/:thread_id/post/:post_id", (req,res) => {})

module.exports = app;