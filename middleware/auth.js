const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const config = require("config");

async function auth(req, res, next) {
  // const token = req.header("x-auth-token");
  // let token = req.header("x-authorization");
  let token = req.header("x-access-token");

  if (token.startsWith("Bearer")) {
    // Remove Bearer from string
    token = token.split(" ")[1];
  }

  if (!token) {
    token = req.header("x-refresh-token");

    if (token.startsWith("Bearer")) {
      // Remove Bearer from string
      token = token.split(" ")[1];
    }

    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }

    try {
      const verify = jwt.verify(token, config.get("jwtPrivateRefreshKey"));
      const user = await User.findOne({ _id: verify._id });
      token = jwt.sign(
        { _id: user._id, isAdmin: user.isAdmin },
        config.get("jwtPrivateAccessKey"),
        {
          expiresIn: "1m",
        }
      );
    } catch (error) {
      return res.status(400).send("Invalid token.");
    }
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateAccessKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
}

// function token(req, res, next) {
//   let refreshToken = req.header("x-refresh-token");

//   if (refreshToken.startsWith("Bearer")) {
//     // Remove Bearer from string
//     refreshToken = refreshToken.split(" ")[1];
//   }

//   if (!refreshToken) {
//     return res.status(401).send("Access denied. No token provided.");
//   }

//   try {
//     const verify = jwt.verify(refreshToken, config.get("jwtPrivateRefreshKey"));
//     const accessToken = jwt.sign(verify, config.get("jwtPrivateAccessKey"), {
//       expiresIn: "1m",
//     });
//     req.user = accessToken;
//     next();
//   } catch (ex) {
//     res.status(400).send("Invalid token.");
//   }
// }

module.exports = auth;
// module.exports = token;
