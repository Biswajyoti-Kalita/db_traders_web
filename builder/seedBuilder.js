const fs = require("fs");
const path = require("path");
const { makePluralize } = require("./helper");
const bcrypt = require("bcryptjs");

const header_seed = `
	const app = require('./app');
	const db = require('./models');
    const PasswordService = require('./services/passwordService');
	async function createSeeds() {
`;
const footer_seed = `
}
createSeeds();
`;

module.exports = {
  generateSeed: function (config_models) {
    var file_data = "";
    for (item in config_models) {
      var current_model = config_models[item];
      if (current_model.seed) {
        current_model.seed.map((item2) => {
          file_data += `await db.${current_model.name}.create( ${JSON.stringify(
            item2
          )} );`;
        });
      }
    }

    fs.writeFileSync(
      __dirname + "/../release/seed.js",
      header_seed + file_data + footer_seed,
      function (err) {
        if (err) return console.log(err);
      }
    );
  },
};
