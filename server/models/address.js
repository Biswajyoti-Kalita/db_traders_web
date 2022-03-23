
				module.exports = function(sequelize, DataTypes) {
				    const address = sequelize.define("address", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					landmark: {
						type: DataTypes.STRING,
												
					},
					address_line_1: {
						type: DataTypes.STRING,
												
					},
					address_line_2: {
						type: DataTypes.STRING,
												
					},
					city: {
						type: DataTypes.STRING,
												
					},
					state: {
						type: DataTypes.STRING,
												
					},
					pincode: {
						type: DataTypes.STRING,
												
					},
					tag: {
						type: DataTypes.STRING,
												
					},
				    });
				    address.associate = function(models) {
					address.belongsTo(models.user, {
						foreignKey: "user_id",
						as: "user",
			            constraints: false
					});

				};

					return address;
				}
			