
				module.exports = function(sequelize, DataTypes) {
				    const cart = sequelize.define("cart", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					quantity: {
						type: DataTypes.INTEGER,
												
					},
					status: {
						type: DataTypes.INTEGER,
												
					},
				    });
				    cart.associate = function(models) {
					cart.belongsTo(models.product, {
						foreignKey: "product_id",
						as: "product",
			            constraints: false
					});

				
					cart.belongsTo(models.user, {
						foreignKey: "user_id",
						as: "user",
			            constraints: false
					});

				};

					return cart;
				}
			