
				module.exports = function(sequelize, DataTypes) {
				    const order = sequelize.define("order", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					bill_no: {
						type: DataTypes.STRING,
												
					},
					delivery_status: {
						type: DataTypes.INTEGER,
												
					},
					cancelled_reason: {
						type: DataTypes.STRING,
												
					},
					payment_status: {
						type: DataTypes.INTEGER,
												
					},
					order_status: {
						type: DataTypes.INTEGER,
												
					},
					payment_method: {
						type: DataTypes.STRING,
												
					},
					total_price: {
						type: DataTypes.DOUBLE,
												
					},
				    });
				    order.associate = function(models) {
					order.hasMany(models.order_item, {
						foreignKey: "order_items",
						as: "order_items",
			            constraints: false
					});

				
					order.belongsTo(models.user, {
						foreignKey: "user_id",
						as: "user",
			            constraints: false
					});

				
					order.belongsTo(models.address, {
						foreignKey: "address_id",
						as: "address",
			            constraints: false
					});

				
					order.belongsTo(models.coupon, {
						foreignKey: "coupon_id",
						as: "coupon",
			            constraints: false
					});

				};

					return order;
				}
			