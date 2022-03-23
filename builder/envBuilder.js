const fs = require("fs");
const path = require("path");

module.exports = {
  generateEnv: function (config_env) {
    var env_data = "";

    for (var key in config_env) {
      if (key) {
        env_data += `
${key} = ${config_env[key]} `;
      }
    }

    fs.writeFileSync(__dirname + "/../release/.env", env_data, function (err) {
      if (err) return console.log(err);
    });
  },
};
