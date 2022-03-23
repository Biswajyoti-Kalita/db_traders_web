
				module.exports = function(sequelize, DataTypes) {
				    const order_item = sequelize.define("order_item", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					quantity: {
						type: DataTypes.INTEGER,
												
					},
					cost_price: {
						type: DataTypes.DOUBLE,
												
					},
					selling_price: {
						type: DataTypes.DOUBLE,
												
					},
					tax: {
						type: DataTypes.DOUBLE,
												
					},
					cgst: {
						type: DataTypes.DOUBLE,
												
					},
					sgst: {
						type: DataTypes.DOUBLE,
												
					},
					igst: {
						type: DataTypes.DOUBLE,
												
					},
					discount: {
						type: DataTypes.DOUBLE,
												
					},
				    });
				    order_item.associate = function(models) {
					order_item.belongsTo(models.product, {
						foreignKey: "product_id",
						as: "product",
			            constraints: false
					});

				
					order_item.belongsTo(models.user, {
						foreignKey: "user_id",
						as: "user",
			            constraints: false
					});

				
					order_item.belongsTo(models.order, {
						foreignKey: "order_id",
						as: "order",
			            constraints: false
					});

				
					order_item.belongsTo(models.coupon, {
						foreignKey: "coupon_id",
						as: "coupon",
			            constraints: false
					});

				};

					return order_item;
				}
			