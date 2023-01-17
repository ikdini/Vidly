const bcrypt = require("bcrypt");

async function run() {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash("1234", salt);
  console.log("async salt", salt);
  console.log("async hashed", hashed);
}

bcrypt.genSalt(10).then((salt)=> bcrypt.hash("1234", salt)).then((hash)=> console.log(hash)).catch((e)=> console.log(e));

run();
