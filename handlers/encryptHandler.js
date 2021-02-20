const crypto = require("crypto");

const encryptHandler = (payload) => {
  return crypto.createHmac("sha256", "hash").update(payload).digest("hex");
};

module.exports = encryptHandler;
