
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


const role = 1;
					app.post("/client/addpayment",roleService.verifyRole(role),   async function(req, res) {
					    try {

							
							  if(req.body.payment_id === null || req.body.payment_id === undefined)
								  return res.send({status  : "error", message : " Payment Id is required " })
						  
							  if(req.body.oid === null || req.body.oid === undefined)
								  return res.send({status  : "error", message : " Oid is required " })
						  
							  if(req.body.payment_status === null || req.body.payment_status === undefined)
								  return res.send({status  : "error", message : " Payment Status is required " })
						  


					        await db.payment.create({
		
			payment_id : req.body.payment_id,
		
			oid : req.body.oid,
		
			payment_status : req.body.payment_status,
		
			
		
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
				
					app.post("/client/updatepayment",  roleService.verifyRole(role),  async function(req, res) {
					    try {
					        await db.payment.update({
		
			payment_id : req.body.payment_id,
		
			oid : req.body.oid,
		
			payment_status : req.body.payment_status,
		
			
		
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
				
					app.post("/client/deletepayment",  roleService.verifyRole(role),  async function(req, res) {

					    try {
					        await db.payment.destroy({
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
				
					app.post("/client/bulkdeletepayment", roleService.verifyRole(role),  async function(req, res) {

						if(!req.body.ids || !Array.isArray(req.body.ids)){
							return res.send({
								status : "error",
								message: "Please send ids as array"

							})
						}


					    try {
					        await db.payment.destroy({
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
				
				app.post("/client/getpayments",  roleService.verifyRole(role),  async function(req, res) {


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

					
			
			if(req.body.payment_id != null)
				where['payment_id'] =  req.body.payment_id;
		
			if(req.body.oid != null)
				where['oid'] =  req.body.oid;
		
			if(req.body.payment_status != null)
				where['payment_status'] =  req.body.payment_status;
		
	;

				    try {
					        const payments = await db.payment.findAndCountAll({
					        where: where,
				        	offset : req.body.offset ? +req.body.offset : null,
				        	limit : req.body.limit ? +req.body.limit : 25,
				        	order : order_arr,
				        	include : [
				        		
		
	
				        	]
				        });
				        res.send(payments);
				    } catch (error) {
				        console.log(error);
				        res.send({
				            status: "error",
				            message: "Something went wrong"
				        })
				    }
				});
				
				app.post("/client/getpayment",  roleService.verifyRole(role),  async function(req, res) {
				    try {
				        const payment = await db.payment.findOne({
				        	where : {
				        		id : req.body.id
				        	},
				        	include : [
				        		
		
	
				        	],				        	
				        	attributes: ['id','payment_id','oid','payment_status']
				        });
				        res.send(payment);
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

