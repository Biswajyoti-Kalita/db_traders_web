
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
					app.post("/others/addcart",roleService.verifyRole(role),   async function(req, res) {
					    try {

							
							  if(req.body.quantity === null || req.body.quantity === undefined)
								  return res.send({status  : "error", message : " Quantity is required " })
						  
							  if(req.body.status === null || req.body.status === undefined)
								  return res.send({status  : "error", message : " Status is required " })
						  


					        await db.cart.create({
		
			quantity : req.body.quantity,
		
			status : req.body.status,
		
			
		
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
				
					app.post("/others/updatecart",  roleService.verifyRole(role),  async function(req, res) {
					    try {
					        await db.cart.update({
		
			quantity : req.body.quantity,
		
			status : req.body.status,
		
			
		
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
				
					app.post("/others/deletecart",  roleService.verifyRole(role),  async function(req, res) {

					    try {
					        await db.cart.destroy({
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
				
					app.post("/others/bulkdeletecart", roleService.verifyRole(role),  async function(req, res) {

						if(!req.body.ids || !Array.isArray(req.body.ids)){
							return res.send({
								status : "error",
								message: "Please send ids as array"

							})
						}


					    try {
					        await db.cart.destroy({
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
				
				app.post("/others/getcarts",  roleService.verifyRole(role),  async function(req, res) {


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
		
			if(req.body.status != null)
				where['status'] =  req.body.status;
		
	;

				    try {
					        const carts = await db.cart.findAndCountAll({
					        where: where,
				        	offset : req.body.offset ? +req.body.offset : null,
				        	limit : req.body.limit ? +req.body.limit : 25,
				        	order : order_arr,
				        	include : [
				        		
		
	
				        	]
				        });
				        res.send(carts);
				    } catch (error) {
				        console.log(error);
				        res.send({
				            status: "error",
				            message: "Something went wrong"
				        })
				    }
				});
				
				app.post("/others/getcart",  roleService.verifyRole(role),  async function(req, res) {
				    try {
				        const cart = await db.cart.findOne({
				        	where : {
				        		id : req.body.id
				        	},
				        	include : [
				        		
		
	
				        	],				        	
				        	attributes: ['id','quantity','status']
				        });
				        res.send(cart);
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

