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
      "/others/addproduct",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.uuid === null || req.body.uuid === undefined)
            return res.send({ status: "error", message: " Uuid is required " });

          if (req.body.barcode === null || req.body.barcode === undefined)
            return res.send({
              status: "error",
              message: " Barcode is required ",
            });

          if (req.body.name === null || req.body.name === undefined)
            return res.send({ status: "error", message: " Name is required " });

          if (req.body.tags === null || req.body.tags === undefined)
            return res.send({ status: "error", message: " Tags is required " });

          if (req.body.colors === null || req.body.colors === undefined)
            return res.send({
              status: "error",
              message: " Colors is required ",
            });

          if (req.body.cost_price === null || req.body.cost_price === undefined)
            return res.send({
              status: "error",
              message: " Cost Price is required ",
            });

          if (
            req.body.selling_price === null ||
            req.body.selling_price === undefined
          )
            return res.send({
              status: "error",
              message: " Selling Price is required ",
            });

          if (req.body.tax === null || req.body.tax === undefined)
            return res.send({ status: "error", message: " Tax is required " });

          if (req.body.cgst === null || req.body.cgst === undefined)
            return res.send({ status: "error", message: " Cgst is required " });

          if (req.body.sgst === null || req.body.sgst === undefined)
            return res.send({ status: "error", message: " Sgst is required " });

          if (req.body.igst === null || req.body.igst === undefined)
            return res.send({ status: "error", message: " Igst is required " });

          if (req.body.discount === null || req.body.discount === undefined)
            return res.send({
              status: "error",
              message: " Discount is required ",
            });

          if (
            req.body.description === null ||
            req.body.description === undefined
          )
            return res.send({
              status: "error",
              message: " Description is required ",
            });

          await db.product.create({
            uuid: req.body.uuid,

            barcode: req.body.barcode,

            name: req.body.name,

            tags: req.body.tags,

            colors: req.body.colors,

            cost_price: req.body.cost_price,

            selling_price: req.body.selling_price,

            tax: req.body.tax,

            cgst: req.body.cgst,

            sgst: req.body.sgst,

            igst: req.body.igst,

            discount: req.body.discount,

            description: req.body.description,
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
      "/others/updateproduct",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          await db.product.update(
            {
              uuid: req.body.uuid,

              barcode: req.body.barcode,

              name: req.body.name,

              tags: req.body.tags,

              colors: req.body.colors,

              cost_price: req.body.cost_price,

              selling_price: req.body.selling_price,

              tax: req.body.tax,

              cgst: req.body.cgst,

              sgst: req.body.sgst,

              igst: req.body.igst,

              discount: req.body.discount,

              description: req.body.description,
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
      "/others/deleteproduct",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          await db.product.destroy({
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
      "/others/bulkdeleteproduct",
      roleService.verifyRole(role),
      async function (req, res) {
        if (!req.body.ids || !Array.isArray(req.body.ids)) {
          return res.send({
            status: "error",
            message: "Please send ids as array",
          });
        }

        try {
          await db.product.destroy({
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

    app.post("/others/getproducts", async function (req, res) {
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

      if (req.body.uuid != null) where["uuid"] = req.body.uuid;

      if (req.body.barcode != null) where["barcode"] = req.body.barcode;

      if (req.body.name != null) where["name"] = req.body.name;

      if (req.body.tags != null) where["tags"] = req.body.tags;

      if (req.body.colors != null) where["colors"] = req.body.colors;

      if (req.body.cost_price != null)
        where["cost_price"] = req.body.cost_price;

      if (req.body.selling_price != null)
        where["selling_price"] = req.body.selling_price;

      if (req.body.tax != null) where["tax"] = req.body.tax;

      if (req.body.cgst != null) where["cgst"] = req.body.cgst;

      if (req.body.sgst != null) where["sgst"] = req.body.sgst;

      if (req.body.igst != null) where["igst"] = req.body.igst;

      if (req.body.discount != null) where["discount"] = req.body.discount;

      if (req.body.description != null)
        where["description"] = req.body.description;

      try {
        const products = await db.product.findAndCountAll({
          where: where,
          offset: req.body.offset ? +req.body.offset : 0,
          limit: req.body.limit ? +req.body.limit : 25,
          order: order_arr,
          include: [
            {
              model: db.image,
              as: "images",
            },
            {
              model: db.brand,
              as: "brand",
            },
            {
              model: db.category,
              as: "category",
            },
            {
              model: db.category,
              as: "sub_category",
            },
          ],
        });
        res.send(products);
      } catch (error) {
        console.log(error);
        res.send({
          status: "error",
          message: "Something went wrong",
        });
      }
    });

    app.post("/others/getproduct", async function (req, res) {
      try {
        const product = await db.product.findOne({
          where: {
            id: req.body.id,
          },
          include: [
            {
              model: db.image,
              as: "images",
            },
            {
              model: db.brand,
              as: "brand",
            },
            {
              model: db.category,
              as: "category",
            },
            {
              model: db.category,
              as: "sub_category",
            },
          ],
          attributes: [
            "id",
            "uuid",
            "barcode",
            "name",
            "tags",
            "colors",
            "selling_price",
            "tax",
            "cgst",
            "sgst",
            "igst",
            "discount",
            "description",
          ],
        });
        res.send(product);
      } catch (error) {
        console.log(error);
        res.send({
          status: "error",
          message: "Something went wrong",
        });
      }
    });
  },
};
