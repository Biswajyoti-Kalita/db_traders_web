const fs = require("fs");
const path = require("path");

module.exports = {
  startCopy: async function (config_copy) {
    var env_data = "";

    for (var key in config_copy) {
      if (key) {
        await fs.copyFile(
          __dirname + "/../" + key,
          __dirname + "/../" + config_copy[key],
          (err) => {
            if (err) throw err;
          }
        );
      }
    }
  },
};
