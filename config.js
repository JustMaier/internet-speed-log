var config = {
	port: 8080,
	locale: "en",
	logDest: "/log.json",
	updateCron: '0 * * * *',
	timezone: 'America/Los_Angeles',
	speedtestTimeout: 20000,
	includeServer: false,
	daysToKeep: 60,
	recordsPerDay: 24 //Change this if you change your cron
}

if(typeof module !=  typeof undefined) module.exports = config;