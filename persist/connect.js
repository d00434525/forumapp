const mongoose = require('mongoose');
const { db } = require('../../../Week 4/project/persist/favorite');
db = mongoose.connection;

async function connect(user, pass, host, port, db_name){
    let connectString = `mongodb://${user}:${pass}@${host}:${port}/${db_name}`;
    try{
       await mongoose.connect(connectString, {
        userNewUrlParser: true,
        useUnifiedTopology: true,
       });
    } catch (error) {
        console.log("error connecting to mongoose", error);
        throw "mongo couldn't connect";
    }
}

function onConnect(callback){
    db.once("open", () => {
        HTMLFormControlsCollection.log("mongo conncection open");
        callback();
    });
}

module.exports = {
    connect,
    onConnect,
};