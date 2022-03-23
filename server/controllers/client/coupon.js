
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
					app.post("/client/addcoupon",roleService.verifyRole(role),   async function(req, res) {
					    try {

							
							  if(req.body.code === null || req.body.code === undefined)
								  return res.send({status  : "error", message : " Code is required " })
						  
							  if(req.body.valid_till === null || req.body.valid_till === undefined)
								  return res.send({status  : "error", message : " Valid Till is required " })
						  
							  if(req.body.discount_amount === null || req.body.discount_amount === undefined)
								  return res.send({status  : "error", message : " Discount Amount is required " })
						  


					        await db.coupon.create({
		
			code : req.body.code,
		
			valid_till : req.body.valid_till,
		
			discount_amount : req.body.discount_amount,
		
			
		
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
				
					app.post("/client/updatecoupon",  roleService.verifyRole(role),  async function(req, res) {
					    try {
					        await db.coupon.update({
		
			code : req.body.code,
		
			valid_till : req.body.valid_till,
		
			discount_amount : req.body.discount_amount,
		
			
		
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
				
					app.post("/client/deletecoupon",  roleService.verifyRole(role),  async function(req, res) {

					    try {
					        await db.coupon.destroy({
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
				
					app.post("/client/bulkdeletecoupon", roleService.verifyRole(role),  async function(req, res) {

						if(!req.body.ids || !Array.isArray(req.body.ids)){
							return res.send({
								status : "error",
								message: "Please send ids as array"

							})
						}


					    try {
					        await db.coupon.destroy({
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
				
				app.post("/client/getcoupons",  roleService.verifyRole(role),  async function(req, res) {


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

					
			
			if(req.body.code != null)
				where['code'] =  req.body.code;
		
			if(req.body.valid_till != null)
				where['valid_till'] =  req.body.valid_till;
		
			if(req.body.discount_amount != null)
				where['discount_amount'] =  req.body.discount_amount;
		
	;

				    try {
					        const coupons = await db.coupon.findAndCountAll({
					        where: where,
				        	offset : req.body.offset ? +req.body.offset : null,
				        	limit : req.body.limit ? +req.body.limit : 25,
				        	order : order_arr,
				        	include : [
				        		
		
	
				        	]
				        });
				        res.send(coupons);
				    } catch (error) {
				        console.log(error);
				        res.send({
				            status: "error",
				            message: "Something went wrong"
				        })
				    }
				});
				
				app.post("/client/getcoupon",  roleService.verifyRole(role),  async function(req, res) {
				    try {
				        const coupon = await db.coupon.findOne({
				        	where : {
				        		id : req.body.id
				        	},
				        	include : [
				        		
		
	
				        	],				        	
				        	attributes: ['id','code','valid_till','discount_amount']
				        });
				        res.send(coupon);
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

