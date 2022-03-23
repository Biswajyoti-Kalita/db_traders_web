
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


const role = 0;
					app.post("/admin/addaddress",roleService.verifyRole(role),   async function(req, res) {
					    try {

							
							  if(req.body.landmark === null || req.body.landmark === undefined)
								  return res.send({status  : "error", message : " Landmark is required " })
						  
							  if(req.body.address_line_1 === null || req.body.address_line_1 === undefined)
								  return res.send({status  : "error", message : " Address Line 1 is required " })
						  
							  if(req.body.address_line_2 === null || req.body.address_line_2 === undefined)
								  return res.send({status  : "error", message : " Address Line 2 is required " })
						  
							  if(req.body.city === null || req.body.city === undefined)
								  return res.send({status  : "error", message : " City is required " })
						  
							  if(req.body.state === null || req.body.state === undefined)
								  return res.send({status  : "error", message : " State is required " })
						  
							  if(req.body.pincode === null || req.body.pincode === undefined)
								  return res.send({status  : "error", message : " Pincode is required " })
						  
							  if(req.body.tag === null || req.body.tag === undefined)
								  return res.send({status  : "error", message : " Tag is required " })
						  


					        await db.address.create({
		
			landmark : req.body.landmark,
		
			address_line_1 : req.body.address_line_1,
		
			address_line_2 : req.body.address_line_2,
		
			city : req.body.city,
		
			state : req.body.state,
		
			pincode : req.body.pincode,
		
			tag : req.body.tag,
		
			
		
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
				
					app.post("/admin/updateaddress",  roleService.verifyRole(role),  async function(req, res) {
					    try {
					        await db.address.update({
		
			landmark : req.body.landmark,
		
			address_line_1 : req.body.address_line_1,
		
			address_line_2 : req.body.address_line_2,
		
			city : req.body.city,
		
			state : req.body.state,
		
			pincode : req.body.pincode,
		
			tag : req.body.tag,
		
			
		
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
				
					app.post("/admin/deleteaddress",  roleService.verifyRole(role),  async function(req, res) {

					    try {
					        await db.address.destroy({
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
				
					app.post("/admin/bulkdeleteaddress", roleService.verifyRole(role),  async function(req, res) {

						if(!req.body.ids || !Array.isArray(req.body.ids)){
							return res.send({
								status : "error",
								message: "Please send ids as array"

							})
						}


					    try {
					        await db.address.destroy({
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
				
				app.post("/admin/getaddresses",  roleService.verifyRole(role),  async function(req, res) {


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

					
			
			if(req.body.landmark != null)
				where['landmark'] =  req.body.landmark;
		
			if(req.body.address_line_1 != null)
				where['address_line_1'] =  req.body.address_line_1;
		
			if(req.body.address_line_2 != null)
				where['address_line_2'] =  req.body.address_line_2;
		
			if(req.body.city != null)
				where['city'] =  req.body.city;
		
			if(req.body.state != null)
				where['state'] =  req.body.state;
		
			if(req.body.pincode != null)
				where['pincode'] =  req.body.pincode;
		
			if(req.body.tag != null)
				where['tag'] =  req.body.tag;
		
	;

				    try {
					        const addresss = await db.address.findAndCountAll({
					        where: where,
				        	offset : req.body.offset ? +req.body.offset : null,
				        	limit : req.body.limit ? +req.body.limit : 25,
				        	order : order_arr,
				        	include : [
				        		
		
	
				        	]
				        });
				        res.send(addresss);
				    } catch (error) {
				        console.log(error);
				        res.send({
				            status: "error",
				            message: "Something went wrong"
				        })
				    }
				});
				
				app.post("/admin/getaddress",  roleService.verifyRole(role),  async function(req, res) {
				    try {
				        const address = await db.address.findOne({
				        	where : {
				        		id : req.body.id
				        	},
				        	include : [
				        		
		
	
				        	],				        	
				        	attributes: ['id','landmark','address_line_1','address_line_2','city','state','pincode','tag']
				        });
				        res.send(address);
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

