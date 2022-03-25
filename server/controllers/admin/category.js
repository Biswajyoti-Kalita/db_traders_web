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
var file_upload = require("./../../services/upload");
var roleService = require("./../../services/roleService");
var passwordService = require("./../../services/passwordService");

module.exports = {
  initializeApi: function (app) {
    const basic_attributes = ["createdAt", "updatedAt"];

    const role = 0;
    app.post(
      "/admin/addcategory",
      roleService.verifyRole(role),
      file_upload.single("image"),
      async function (req, res) {
        try {
          if (req.body.name === null || req.body.name === undefined)
            return res.send({ status: "error", message: " Name is required " });

          let obj = {
            name: req.body.name,
            parent_id: req.body.parent,
          };

          if (req.file && req.file.path) {
            obj["image_url"] =
              "/uploads/" +
              req.file.path.substr(req.file.path.lastIndexOf("/") + 1);
          }
          await db.category.create(obj);
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
      }
    );

    app.post(
      "/admin/updatecategory",
      roleService.verifyRole(role),
      file_upload.single("image"),
      async function (req, res) {
        try {
          let obj = {
            name: req.body.name,
            parent_id: req.body.parent,
          };

          if (req.file && req.file.path) {
            obj["image_url"] =
              "/uploads/" +
              req.file.path.substr(req.file.path.lastIndexOf("/") + 1);
          }
          await db.category.update(obj, {
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
      }
    );

    app.post(
      "/admin/deletecategory",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          await db.category.destroy({
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
      }
    );

    app.post(
      "/admin/bulkdeletecategory",
      roleService.verifyRole(role),
      async function (req, res) {
        if (!req.body.ids || !Array.isArray(req.body.ids)) {
          return res.send({
            status: "error",
            message: "Please send ids as array",
          });
        }

        try {
          await db.category.destroy({
            where: {
              id: {
                [Op.in]: req.body.ids,
              },
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
      }
    );

    app.post(
      "/admin/getcategories",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = {};
        const order = req.body.order ? req.body.order : "id";
        const order_by = req.body.order_by ? req.body.order_by : "DESC";
        let order_arr = [];

        if (order.indexOf(".") >= 0) {
          const tempArr = order.split(".");
          tempArr.push(order_by);
          order_arr = [tempArr];
        } else {
          order_arr = [[order, order_by]];
        }

        if (req.body.name != null) where["name"] = req.body.name;

        if (req.body.parent != null) where["parent"] = req.body.parent;

        if (req.body.image_url != null) where["image_url"] = req.body.image_url;

        try {
          const categorys = await db.category.findAndCountAll({
            where: where,
            offset: req.body.offset ? +req.body.offset : null,
            limit: req.body.limit ? +req.body.limit : 25,
            order: order_arr,
            include: [
              {
                model: db.category,
                as: "parent",
                required: false,
              },
            ],
          });
          res.send(categorys);
        } catch (error) {
          console.log(error);
          res.send({
            status: "error",
            message: "Something went wrong",
          });
        }
      }
    );

    app.post(
      "/admin/getcategory",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const category = await db.category.findOne({
            where: {
              id: req.body.id,
            },
            include: [],
            attributes: ["id", "name", "parent", "image_url"],
          });
          res.send(category);
        } catch (error) {
          console.log(error);
          res.send({
            status: "error",
            message: "Something went wrong",
          });
        }
      }
    );
  },
};
