const app = require("./server");
const { connect, onConnect } = require("./persist/connect");

onConnect(() => {
    app.listen(8080, () => {
        console.log("serving on port 8080");
    });
});

try {
    await connect(
        config.mongo_user,
        config.mongo_pass,
        config.mongo_host,
        config.mongo_port,
        config.mongo_db
    );
} catch (error) {
    console.log(error);
    throw "couldn't start";
}