db.createUser({
	user: 'furrax',
	pwd: 'furrax',
	roles: [
		{
			role: 'readWrite',
			db: 'furrax',
		},
	],
	passwordDigestor: 'server'
});
