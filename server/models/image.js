
				module.exports = function(sequelize, DataTypes) {
				    const image = sequelize.define("image", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					image_url: {
						type: DataTypes.TEXT,
												
					},
					size: {
						type: DataTypes.INTEGER,
												
					},
				    });
				    image.associate = function(models) {
					image.belongsTo(models.product, {
						foreignKey: "product_id",
						as: "product",
			            constraints: false
					});

				};

					return image;
				}
			