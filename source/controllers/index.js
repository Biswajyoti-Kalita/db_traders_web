// const AdminControllers = require("./admin/index");
const StudentControllers = require("./student/index");
const TutorControllers = require("./tutor/index");
const UserControllers = require("./user/index");


module.exports = function initializeApi(app) {
    const allControllers = [ TutorControllers, UserControllers , StudentControllers];
	allControllers.forEach(item => item.initializeApi(app))
    return app;
};
     