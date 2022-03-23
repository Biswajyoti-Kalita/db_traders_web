
				module.exports = function(sequelize, DataTypes) {
				    const coupon = sequelize.define("coupon", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					code: {
						type: DataTypes.STRING,
												
					},
					valid_till: {
						type: DataTypes.DATEONLY,
												
					},
					discount_amount: {
						type: DataTypes.DOUBLE,
												
					},
					status: {
						type: DataTypes.INTEGER,
												
					},
				    });
				    

					return coupon;
				}
			