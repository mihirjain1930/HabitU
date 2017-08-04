module.exports = {
	servers: {
		one: {
			host: 'prod1.mzmtech.com',
			// host: '35.185.29.4',
			username: 'deploy',
			pem: '/Users/maxmatthews/.ssh/v1DeployKey',
			// password:
			// or leave blank for authenticate from ssh-agent
			opts: {
				port: 2220,
			},
		}
	},

	meteor: {
		name: 'habitU',
		path: '/Users/maxmatthews/Desktop/Projects/habitU/meteor',
		// port: 3005,
		servers: {
			one: {},
		},
		buildOptions: {
			serverOnly: true,
		},
		env: {
			PORT: 3006,
			ROOT_URL: 'https://habitu.mzmtech.com',
			MONGO_URL: 'mongodb://localhost/meteor',
		},
		// ssl: {
		// 	autogenerate: {
		// 		email: 'max@mzmtech.com',
		// 		domains: 'bxlp.mzmtech.com'
		// 	}
		// },
		// change to 'kadirahq/meteord' if your app is not using Meteor 1.4
		docker:{
			image: 'abernix/meteord:base'
		},
		deployCheckWaitTime: 60,

		// Show progress bar while uploading bundle to server
		// You might need to disable it on CI servers
		enableUploadProgressBar: false
	},

	mongo: {
		oplog: true,
		port: 27017,
		version: '3.4.1',
		servers: {
			one: {},
		},
	},
};
