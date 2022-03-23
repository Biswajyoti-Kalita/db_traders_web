
				module.exports = function(sequelize, DataTypes) {
				    const review = sequelize.define("review", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					rating: {
						type: DataTypes.INTEGER,
												
					},
					comments: {
						type: DataTypes.TEXT,
												
					},
					status: {
						type: DataTypes.INTEGER,
												
					},
				    });
				    review.associate = function(models) {
					review.belongsTo(models.user, {
						foreignKey: "user_id",
						as: "user",
			            constraints: false
					});

				
					review.belongsTo(models.product, {
						foreignKey: "product_id",
						as: "product",
			            constraints: false
					});

				};

					return review;
				}
			