
				module.exports = function(sequelize, DataTypes) {
				    const payment = sequelize.define("payment", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					payment_id: {
						type: DataTypes.STRING,
												
					},
					oid: {
						type: DataTypes.STRING,
												
					},
					payment_status: {
						type: DataTypes.INTEGER,
												
					},
				    });
				    payment.associate = function(models) {
					payment.belongsTo(models.order, {
						foreignKey: "order_id",
						as: "order",
			            constraints: false
					});

				};

					return payment;
				}
			