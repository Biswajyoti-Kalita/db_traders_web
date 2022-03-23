const fs = require("fs");
const path = require("path");
const { makeUpperCase } = require("./helper");

function getSubFields(data) {
  data = data.substr(1);
  data = data.substr(0, data.length - 1);
  data = data.replaceAll(",", ",\n");
  return data;
}
function getAssociation(order) {
  switch (order) {
    case "1:1":
      return "belongsTo";
    case "1:N":
      return "hasMany";
    case "N:1":
      return "belongsTo";
    default:
      return "belongsTo";
  }
}

module.exports = {
  generateModel: function (config_models) {
    for (item in config_models) {
      var current_model = config_models[item];
      var file_data = "";
      var join_data = "";
      var field_data = `
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },`;

      current_model.fields.map((item) => {
        //console.log("fields item => ",item);
        field_data += `
					${item[0]}: {
						type: DataTypes.${makeUpperCase(item[1])},
						${JSON.stringify(item[2]) == "{}" ? "" : getSubFields(JSON.stringify(item[2]))}						
					},`;
      });

      current_model.join.map((item) => {
        //console.log("fields item => ",item);
        join_data += `
					${current_model.name}.${getAssociation(item.order ? item.order : "")}(models.${
          item.db
        }, {
						foreignKey: "${item.field}",
						as: "${item.as}",
			            constraints: false
					});

				`;
      });
      file_data = `
				module.exports = function(sequelize, DataTypes) {
				    const ${current_model.name} = sequelize.define("${current_model.name}", {
				    	${field_data}
				    });
				    ${
              join_data.length > 1
                ? current_model.name +
                  ".associate = function(models) {" +
                  join_data +
                  "};"
                : ""
            }

					return ${current_model.name};
				}
			`;

      fs.writeFileSync(
        __dirname + "/../release/models/" + current_model.name + ".js",
        file_data,
        function (err) {
          if (err) return console.log(err);
        }
      );
    }
  },
};
