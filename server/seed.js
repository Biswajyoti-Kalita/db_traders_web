
	const app = require('./app');
	const db = require('./models');
    const PasswordService = require('./services/passwordService');
	async function createSeeds() {
await db.user.create( {"id":1,"username":"admin","name":"admin","email":"admin@admin.in","password":"a12345","role_id":0} );await db.user.create( {"id":2,"username":"client","name":"client","email":"client@admin.in","password":"a12345","role_id":1} );await db.user.create( {"id":3,"username":"others","name":"others","email":"others@admin.in","password":"a12345","role_id":2} );
}
createSeeds();
