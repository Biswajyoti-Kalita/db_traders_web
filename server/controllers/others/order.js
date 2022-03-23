
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
					app.post("/others/addorder",roleService.verifyRole(role),   async function(req, res) {
					    try {

							
							  if(req.body.bill_no === null || req.body.bill_no === undefined)
								  return res.send({status  : "error", message : " Bill No is required " })
						  
							  if(req.body.delivery_status === null || req.body.delivery_status === undefined)
								  return res.send({status  : "error", message : " Delivery Status is required " })
						  
							  if(req.body.payment_status === null || req.body.payment_status === undefined)
								  return res.send({status  : "error", message : " Payment Status is required " })
						  
							  if(req.body.order_status === null || req.body.order_status === undefined)
								  return res.send({status  : "error", message : " Order Status is required " })
						  
							  if(req.body.payment_method === null || req.body.payment_method === undefined)
								  return res.send({status  : "error", message : " Payment Method is required " })
						  
							  if(req.body.total_price === null || req.body.total_price === undefined)
								  return res.send({status  : "error", message : " Total Price is required " })
						  


					        await db.order.create({
		
			bill_no : req.body.bill_no,
		
			delivery_status : req.body.delivery_status,
		
			payment_status : req.body.payment_status,
		
			order_status : req.body.order_status,
		
			payment_method : req.body.payment_method,
		
			total_price : req.body.total_price,
		
			
		
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
				
					app.post("/others/updateorder",  roleService.verifyRole(role),  async function(req, res) {
					    try {
					        await db.order.update({
		
			bill_no : req.body.bill_no,
		
			delivery_status : req.body.delivery_status,
		
			payment_status : req.body.payment_status,
		
			order_status : req.body.order_status,
		
			payment_method : req.body.payment_method,
		
			total_price : req.body.total_price,
		
			
		
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
				
					app.post("/others/deleteorder",  roleService.verifyRole(role),  async function(req, res) {

					    try {
					        await db.order.destroy({
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
				
					app.post("/others/bulkdeleteorder", roleService.verifyRole(role),  async function(req, res) {

						if(!req.body.ids || !Array.isArray(req.body.ids)){
							return res.send({
								status : "error",
								message: "Please send ids as array"

							})
						}


					    try {
					        await db.order.destroy({
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
				
				app.post("/others/getorders",  roleService.verifyRole(role),  async function(req, res) {


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

					
			
			if(req.body.bill_no != null)
				where['bill_no'] =  req.body.bill_no;
		
			if(req.body.delivery_status != null)
				where['delivery_status'] =  req.body.delivery_status;
		
			if(req.body.payment_status != null)
				where['payment_status'] =  req.body.payment_status;
		
			if(req.body.order_status != null)
				where['order_status'] =  req.body.order_status;
		
			if(req.body.payment_method != null)
				where['payment_method'] =  req.body.payment_method;
		
			if(req.body.total_price != null)
				where['total_price'] =  req.body.total_price;
		
	;

				    try {
					        const orders = await db.order.findAndCountAll({
					        where: where,
				        	offset : req.body.offset ? +req.body.offset : null,
				        	limit : req.body.limit ? +req.body.limit : 25,
				        	order : order_arr,
				        	include : [
				        		
		
	
				        	]
				        });
				        res.send(orders);
				    } catch (error) {
				        console.log(error);
				        res.send({
				            status: "error",
				            message: "Something went wrong"
				        })
				    }
				});
				
				app.post("/others/getorder",  roleService.verifyRole(role),  async function(req, res) {
				    try {
				        const order = await db.order.findOne({
				        	where : {
				        		id : req.body.id
				        	},
				        	include : [
				        		
		
	
				        	],				        	
				        	attributes: ['id','bill_no','delivery_status','payment_status','order_status','payment_method','total_price']
				        });
				        res.send(order);
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

