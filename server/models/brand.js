
				module.exports = function(sequelize, DataTypes) {
				    const brand = sequelize.define("brand", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					name: {
						type: DataTypes.STRING,
												
					},
					image: {
						type: DataTypes.TEXT,
												
					},
				    });
				    

					return brand;
				}
			