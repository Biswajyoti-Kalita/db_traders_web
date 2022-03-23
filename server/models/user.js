
				module.exports = function(sequelize, DataTypes) {
				    const user = sequelize.define("user", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					username: {
						type: DataTypes.STRING,
						"allowNull":false,
"unique":true						
					},
					first_name: {
						type: DataTypes.STRING,
												
					},
					middle_name: {
						type: DataTypes.STRING,
												
					},
					last_name: {
						type: DataTypes.STRING,
												
					},
					gender: {
						type: DataTypes.INTEGER,
												
					},
					email: {
						type: DataTypes.STRING,
												
					},
					phone: {
						type: DataTypes.STRING,
						"limit":20						
					},
					referer: {
						type: DataTypes.STRING,
												
					},
					location: {
						type: DataTypes.STRING,
												
					},
					password: {
						type: DataTypes.STRING,
												
					},
					role_id: {
						type: DataTypes.INTEGER,
												
					},
					status: {
						type: DataTypes.INTEGER,
												
					},
					is_verified: {
						type: DataTypes.INTEGER,
						"defaultValue":0						
					},
				    });
				    user.associate = function(models) {
					user.belongsTo(models.address, {
						foreignKey: "user_id",
						as: "addresses",
			            constraints: false
					});

				};

					return user;
				}
			