db.createUser({
	user: 'furrax',
	pwd: 'furrax',
	roles: [
		{
			role: 'dbAdmin',
			db: 'furrax',
		},
	],
});
