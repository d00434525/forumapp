const passport = require("passport");
const LocalStrategy = require("passport-local");
const {User} = require("../persist/model");

passport.use(
    new LocalStrategy(async (username, password, done) => {
    let user;
    try {
        // try to find the user
        user = await User.findOne({username: username, password: password})
        // did we actually find something?
        if (!user) {
            return done(null, false);
        }
        // we succeeded
        return done(null, user);
    } catch (error) {
        // there was an error looking
        return done(error);
    }
})
);

const setUpAuth = function (app) {
    app.use(passport.initialize());
    app.use(passport.authenticate("session"));

    passport.serializeUser(function(user, cb){
        cb(null, {id: user_id, username: user.username });
    });
    passport.deserializeUser(function(user, cb){
        return cb(null, user);
    });

    app.post("/session", passport.authenticate("local"), (req, res) => {
        res.status(201).json({ message: "successfully created session" });
    });

    app.get("/session", (req,res) => {
        if (!req.user) {
            res.status(401).json({ message: "unauthorized."})
            return
        }
        console.log(req.user);
        res.status(200).json({ message: "authorized."});
    });
};

modules.export = setUpAuth;