const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  winston.info(`Listening on PORT ${port}...`);
  // console.log(`Listening on PORT ${port}...`);
  // console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  // console.log(`APP_ENV: ${app.get("env")}`);
});

module.exports = server;
