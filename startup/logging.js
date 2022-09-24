const winston = require("winston");
// require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  // process.on("uncaughtException", (ex) => {
  //   // console.log("We got an uncaught exception.");
  //   winston.error(ex.message, ex);
  //   process.exit(1);
  // });

  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  // winston.rejections.handle(
  //   new winston.transports.File({ filename: "unhandleRejections.log" })
  // );

  process.on("unhandledRejection", (ex) => {
    // console.log("We got an unhandle rejection.");
    // winston.error(ex.message, ex);
    // process.exit(1);
    throw ex;
  });

  // const p = Promise.reject(new Error("Something failed miserably!"));
  // p.then(() => console.log("Done"));

  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  // winston.add(
  //   new winston.transports.MongoDB(
  //     { db: "mongodb://localhost/vidly" },
  //     { level: "info" }
  //   )
  // );
};
