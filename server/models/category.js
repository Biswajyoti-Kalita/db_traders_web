
				module.exports = function(sequelize, DataTypes) {
				    const category = sequelize.define("category", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					name: {
						type: DataTypes.STRING,
												
					},
					parent_id: {
						type: DataTypes.INTEGER,
												
					},
					image_url: {
						type: DataTypes.TEXT,
												
					},
				    });
				    category.associate = function(models) {
					category.belongsTo(models.category, {
						foreignKey: "parent_id",
						as: "parent",
			            constraints: false
					});

				};

					return category;
				}
			