const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateAccessKey")) {
    throw new Error("FATAL ERROR: jwtPrivateAccessKey is not defined.");
  }

  if (!config.get("jwtPrivateRefreshKey")) {
    throw new Error("FATAL ERROR: jwtPrivateRefreshKey is not defined.");
  }
};
