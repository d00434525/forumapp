// initiate express server
const express = require("express");
const app = express();

// allow serving of UI code
app.use(express.static(`${__dirname}/public/`));

module.exports = app;