
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


const role = 2;
					app.post("/others/addorder_item",roleService.verifyRole(role),   async function(req, res) {
					    try {

							
							  if(req.body.quantity === null || req.body.quantity === undefined)
								  return res.send({status  : "error", message : " Quantity is required " })
						  
							  if(req.body.cost_price === null || req.body.cost_price === undefined)
								  return res.send({status  : "error", message : " Cost Price is required " })
						  
							  if(req.body.selling_price === null || req.body.selling_price === undefined)
								  return res.send({status  : "error", message : " Selling Price is required " })
						  
							  if(req.body.tax === null || req.body.tax === undefined)
								  return res.send({status  : "error", message : " Tax is required " })
						  
							  if(req.body.cgst === null || req.body.cgst === undefined)
								  return res.send({status  : "error", message : " Cgst is required " })
						  
							  if(req.body.sgst === null || req.body.sgst === undefined)
								  return res.send({status  : "error", message : " Sgst is required " })
						  
							  if(req.body.igst === null || req.body.igst === undefined)
								  return res.send({status  : "error", message : " Igst is required " })
						  
							  if(req.body.discount === null || req.body.discount === undefined)
								  return res.send({status  : "error", message : " Discount is required " })
						  


					        await db.order_item.create({
		
			quantity : req.body.quantity,
		
			cost_price : req.body.cost_price,
		
			selling_price : req.body.selling_price,
		
			tax : req.body.tax,
		
			cgst : req.body.cgst,
		
			sgst : req.body.sgst,
		
			igst : req.body.igst,
		
			discount : req.body.discount,
		
			
		
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
				
					app.post("/others/updateorder_item",  roleService.verifyRole(role),  async function(req, res) {
					    try {
					        await db.order_item.update({
		
			quantity : req.body.quantity,
		
			cost_price : req.body.cost_price,
		
			selling_price : req.body.selling_price,
		
			tax : req.body.tax,
		
			cgst : req.body.cgst,
		
			sgst : req.body.sgst,
		
			igst : req.body.igst,
		
			discount : req.body.discount,
		
			
		
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
				
					app.post("/others/deleteorder_item",  roleService.verifyRole(role),  async function(req, res) {

					    try {
					        await db.order_item.destroy({
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
				
					app.post("/others/bulkdeleteorder_item", roleService.verifyRole(role),  async function(req, res) {

						if(!req.body.ids || !Array.isArray(req.body.ids)){
							return res.send({
								status : "error",
								message: "Please send ids as array"

							})
						}


					    try {
					        await db.order_item.destroy({
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
				
				app.post("/others/getorder_items",  roleService.verifyRole(role),  async function(req, res) {


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

					
			
			if(req.body.quantity != null)
				where['quantity'] =  req.body.quantity;
		
			if(req.body.cost_price != null)
				where['cost_price'] =  req.body.cost_price;
		
			if(req.body.selling_price != null)
				where['selling_price'] =  req.body.selling_price;
		
			if(req.body.tax != null)
				where['tax'] =  req.body.tax;
		
			if(req.body.cgst != null)
				where['cgst'] =  req.body.cgst;
		
			if(req.body.sgst != null)
				where['sgst'] =  req.body.sgst;
		
			if(req.body.igst != null)
				where['igst'] =  req.body.igst;
		
			if(req.body.discount != null)
				where['discount'] =  req.body.discount;
		
	;

				    try {
					        const order_items = await db.order_item.findAndCountAll({
					        where: where,
				        	offset : req.body.offset ? +req.body.offset : null,
				        	limit : req.body.limit ? +req.body.limit : 25,
				        	order : order_arr,
				        	include : [
				        		
		
	
				        	]
				        });
				        res.send(order_items);
				    } catch (error) {
				        console.log(error);
				        res.send({
				            status: "error",
				            message: "Something went wrong"
				        })
				    }
				});
				
				app.post("/others/getorder_item",  roleService.verifyRole(role),  async function(req, res) {
				    try {
				        const order_item = await db.order_item.findOne({
				        	where : {
				        		id : req.body.id
				        	},
				        	include : [
				        		
		
	
				        	],				        	
				        	attributes: ['id','quantity','cost_price','selling_price','tax','cgst','sgst','igst','discount']
				        });
				        res.send(order_item);
				    } catch (error) {
				        console.log(error);
				        res.send({
				            status: "error",
				            message: "Something went wrong"
				        })
				    }
				});
				


	}
}

