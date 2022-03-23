
			
			const adminController = require("./admin/index");
			
			const clientController = require("./client/index");
			
			const othersController = require("./others/index");
			
		
			module.exports = function initializeApi(app) {
			    const allControllers = [ adminController,clientController,othersController ];
				allControllers.forEach(item => item.initializeApi(app))
			    return app;
			};
		