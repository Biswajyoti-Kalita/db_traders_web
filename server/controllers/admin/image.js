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
      "/admin/addimage",
      roleService.verifyRole(role),
      file_upload.single("image"),
      async function (req, res) {
        try {
          if (!req.file) {
            return res.send({
              status: "error",
              message: "File not found",
            });
          }
          if (req.body.product_id == null || req.body.product_id == undefined) {
            return res.send({
              status: "error",
              message: "Product Id is required",
            });
          }
          await db.image.create({
            image_url:
              "/uploads/" +
              req.file.path.substr(req.file.path.lastIndexOf("/") + 1),
            product_id: req.body.product_id,
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
      "/admin/updateimage",
      roleService.verifyRole(role),
      file_upload.single("image"),
      async function (req, res) {
        try {
          let obj = {
            product_id: req.body.product_id,
          };
          if (req.file) {
            obj["image_url"] =
              "/uploads/" +
              req.file.path.substr(req.file.path.lastIndexOf("/") + 1);
          }
          await db.image.update(obj, {
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
      "/admin/deleteimage",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          await db.image.destroy({
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
      "/admin/bulkdeleteimage",
      roleService.verifyRole(role),
      async function (req, res) {
        if (!req.body.ids || !Array.isArray(req.body.ids)) {
          return res.send({
            status: "error",
            message: "Please send ids as array",
          });
        }

        try {
          await db.image.destroy({
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
      "/admin/getimages",
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

        if (req.body.image_url != null) where["image_url"] = req.body.image_url;

        if (req.body.size != null) where["size"] = req.body.size;

        try {
          const images = await db.image.findAndCountAll({
            where: where,
            offset: req.body.offset ? +req.body.offset : null,
            limit: req.body.limit ? +req.body.limit : 25,
            order: order_arr,
            include: [
              {
                model: db.product,
                as: "product",
              },
            ],
          });
          res.send(images);
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
      "/admin/getimage",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const image = await db.image.findOne({
            where: {
              id: req.body.id,
            },
            include: [],
            attributes: ["id", "image_url", "size"],
          });
          res.send(image);
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
