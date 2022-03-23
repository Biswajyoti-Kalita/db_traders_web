const fs = require("fs");
const path = require("path");
const Helper = require("./helper");

var header = `
"use strict";
var express = require("express");
var router = express.Router();
var passport = require("passport");
var app = express();
app.use(passport.initialize());
app.use(passport.session());
var randomstring = require("randomstring");
var jwt = require("jsonwebtoken");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var db = require("./../../models");
var file_upload = require('./../../services/upload');
var roleService = require('./../../services/roleService');
var passwordService = require('./../../services/passwordService');


module.exports = {
    initializeApi: function(app) {
        const basic_attributes = ["createdAt","updatedAt"];


`;
var footer = `


	}
}

`;

function getJoins(list) {
  var data = "";

  list.map((item) => {
    data += `
		{
			model : db.${item},
			as : "${item}" 
		},
		`;
  });

  return `
		${data}
	`;
}
function getFilterFields(fields, pre) {
  var data = "";
  fields.map((item) => {
    data += `
			if(req.body.${item} != null)
				where['${item}'] =  req.body.${item};
		`;
  });

  if (pre) {
    data += ` 
			${pre.toString()} 
		`;
  }

  return `
			${data}
	`;
}

function getFields(fields, pre) {
  var data = "";
  fields.map((item) => {
    data += `
			${item} : req.body.${item},
		`;
  });

  if (pre) {
    data += `
			${pre.toString()}
		`;
  }
  return `{
		${data}
	}`;
}

function getAttributes(attributes) {
  var data = "";
  for (var i = 0; i < attributes.length - 1; i++) {
    data += "'" + attributes[i] + "',";
  }
  data += "'" + attributes[attributes.length - 1] + "'";
  return data;
}
function requireFieldsValidation(field_names, model) {
  let returnText = "";

  model.fields?.map((field) => {
    field_names.map((f) => {
      if (field[0] == f) {
        if (field[3] === "required")
          returnText += `
							  if(req.body.${f} === null || req.body.${f} === undefined)
								  return res.send({status  : "error", message : " ${Helper.makeCapital(
                    f,
                    false,
                    true
                  )} is required " })
						  `;
      }
    });
  });
  return returnText;
}
module.exports = {
  generateController: async function (
    config_controllers,
    config_roles,
    config_models
  ) {
    for (item in config_controllers) {
      var current_controller = config_controllers[item];
      var current_model = {};
      var file_data = `${
        config_roles[current_controller.portal]
          ? "const role = " + config_roles[current_controller.portal] + ""
          : "const role = 0"
      };`;
      config_models.map((model) => {
        if (model.name === current_controller.model) current_model = model;
      });
      var add_data = "";
      var edit_data = "";
      var get_data = "";
      var get_datas = "";
      var delete_data = "";

      if (current_controller.is_add) {
        add_data = `
					app.post("/${current_controller.portal}/add${current_controller.name}",${
          current_controller.auth ? "roleService.verifyRole(role), " : ""
        }  async function(req, res) {
					    try {

							${requireFieldsValidation(current_controller.add_fields, current_model)}


					        await db.${current_controller.model}.create(${
          current_controller.add_fields[0] ||
          current_controller.add_fields_pre[0]
            ? getFields(
                current_controller.add_fields,
                current_controller.add_fields_pre
              )
            : "req.body"
        });
					        res.send({
					            status: "success",
					            message: "done",
					        });
					    } catch (error) {
					        res.send({
					            status: "error",
					            message: error,
					        });
					    }
					});
				`;
        file_data += add_data;
      }

      if (current_controller.is_edit) {
        edit_data = `
					app.post("/${current_controller.portal}/update${current_controller.name}",  ${
          current_controller.auth ? "roleService.verifyRole(role), " : ""
        } async function(req, res) {
					    try {
					        await db.${current_controller.model}.update(${
          current_controller.edit_fields[0]
            ? getFields(
                current_controller.edit_fields,
                current_controller.edit_fields_pre
              )
            : "req.body"
        }, {
					            where: {
					                id: req.body.id,
					            },
					        });
					        res.send({
					            status: "success",
					            message: "done",
					        });
					    } catch (error) {
					        res.send({
					            status: "error",
					            message: error,
					        });
					    }
					});
				`;
        file_data += edit_data;
      }

      if (current_controller.is_delete) {
        delete_data = `
					app.post("/${current_controller.portal}/delete${current_controller.name}",  ${
          current_controller.auth ? "roleService.verifyRole(role), " : ""
        } async function(req, res) {

					    try {
					        await db.${current_controller.model}.destroy({
					            where: {
					                id: req.body.id,
					            },
					        });
					        res.send({
					            status: "success",
					            message: "Deleted Successfully",
					        });
					    } catch (error) {
					        res.send({
					            status: "error",
					            message: error,
					        });
					    }
					});
				`;
        file_data += delete_data;
      }

      if (current_controller.is_bulk_delete) {
        delete_data = `
					app.post("/${current_controller.portal}/bulkdelete${
          current_controller.name
        }", ${
          current_controller.auth ? "roleService.verifyRole(role), " : ""
        } async function(req, res) {

						if(!req.body.ids || !Array.isArray(req.body.ids)){
							return res.send({
								status : "error",
								message: "Please send ids as array"

							})
						}


					    try {
					        await db.${current_controller.model}.destroy({
					            where: {
					                id: {
					                	[Op.in] : req.body.ids
					                }
					            },
					        });
					        res.send({
					            status: "success",
					            message: "Deleted Successfully",
					        });
					    } catch (error) {
					        res.send({
					            status: "error",
					            message: error,
					        });
					    }
					});
				`;
        file_data += delete_data;
      }

      if (current_controller.is_view_all) {
        get_datas = `
				app.post("/${current_controller.portal}/get${Helper.makePluralize(
          current_controller.name
        )}",  ${
          current_controller.auth ? "roleService.verifyRole(role), " : ""
        } async function(req, res) {


					let where = {};
					const order = req.body.order ? req.body.order : 'id';
					const order_by = req.body.order_by ? req.body.order_by : "DESC";
					let order_arr = [];

					if(order.indexOf(".")>=0)
					{
						const tempArr = order.split(".");
						tempArr.push(order_by);
						order_arr =[tempArr];
					}
					else{
						order_arr = [[order,order_by]];
					}

					${getFilterFields(current_controller.filter_fields)};

				    try {
					        const ${current_controller.name}s = await db.${
          current_controller.model
        }.findAndCountAll({
					        where: where,
				        	offset : req.body.offset ? +req.body.offset : null,
				        	limit : req.body.limit ? +req.body.limit : 25,
				        	order : order_arr,
				        	include : [
				        		${getJoins(current_controller.join)}
				        	]
				        });
				        res.send(${current_controller.name}s);
				    } catch (error) {
				        console.log(error);
				        res.send({
				            status: "error",
				            message: "Something went wrong"
				        })
				    }
				});
				`;
        file_data += get_datas;
      }

      if (current_controller.is_view) {
        get_data = `
				app.post("/${current_controller.portal}/get${current_controller.name}",  ${
          current_controller.auth ? "roleService.verifyRole(role), " : ""
        } async function(req, res) {
				    try {
				        const ${current_controller.name} = await db.${
          current_controller.model
        }.findOne({
				        	where : {
				        		id : req.body.id
				        	},
				        	include : [
				        		${getJoins(current_controller.join)}
				        	],				        	
				        	attributes: [${getAttributes(current_controller.view_fields)}]
				        });
				        res.send(${current_controller.name});
				    } catch (error) {
				        console.log(error);
				        res.send({
				            status: "error",
				            message: "Something went wrong"
				        })
				    }
				});
				`;
        file_data += get_data;
      }

      if (file_data.length > 1) {
        if (
          !fs.existsSync(
            __dirname + "/../release/controllers/" + current_controller.portal
          )
        ) {
          fs.mkdirSync(
            __dirname + "/../release/controllers/" + current_controller.portal
          );
        }
      }

      fs.writeFileSync(
        __dirname +
          "/../release/controllers/" +
          current_controller.portal +
          "/" +
          current_controller.name +
          ".js",
        header + file_data + footer,
        function (err) {
          if (err) return console.log(err);
        }
      );
    }
  },
};
