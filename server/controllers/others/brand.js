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

    const role = 2;
    app.post(
      "/others/addbrand",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.name === null || req.body.name === undefined)
            return res.send({ status: "error", message: " Name is required " });

          if (req.body.image === null || req.body.image === undefined)
            return res.send({
              status: "error",
              message: " Image is required ",
            });

          await db.brand.create({
            name: req.body.name,

            image: req.body.image,
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
      "/others/updatebrand",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          await db.brand.update(
            {
              name: req.body.name,

              image: req.body.image,
            },
            {
              where: {
                id: req.body.id,
              },
            }
          );
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
      "/others/deletebrand",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          await db.brand.destroy({
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
      "/others/bulkdeletebrand",
      roleService.verifyRole(role),
      async function (req, res) {
        if (!req.body.ids || !Array.isArray(req.body.ids)) {
          return res.send({
            status: "error",
            message: "Please send ids as array",
          });
        }

        try {
          await db.brand.destroy({
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
      "/others/getbrands",
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

        if (req.body.image != null) where["image"] = req.body.image;

        try {
          const brands = await db.brand.findAndCountAll({
            where: where,
            offset: req.body.offset ? +req.body.offset : null,
            limit: req.body.limit ? +req.body.limit : 25,
            order: order_arr,
            include: [],
          });
          res.send(brands);
        } catch (error) {
          console.log(error);
          res.send({
            status: "error",
            message: "Something went wrong",
          });
        }
      }
    );
    app.post("/others/getallbrands", async function (req, res) {
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

      if (req.body.image != null) where["image"] = req.body.image;

      try {
        const brands = await db.brand.findAll({
          where: where,
          order: order_arr,
          include: [],
        });
        res.send(brands);
      } catch (error) {
        console.log(error);
        res.send({
          status: "error",
          message: "Something went wrong",
        });
      }
    });
    app.post(
      "/others/getbrand",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const brand = await db.brand.findOne({
            where: {
              id: req.body.id,
            },
            include: [],
            attributes: ["id", "name", "image"],
          });
          res.send(brand);
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
