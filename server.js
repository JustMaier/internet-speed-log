var config = require('./config.js'),
	server = require('node-http-server'),
	CronJob = require('cron').CronJob,
	speedtest = require('speedtest-net'),
	fs = require('fs');

// Setup http server
server.deploy({
	port: config.port,
	root: __dirname+'/'
});

// Define speedtesting
function updateSpeedLog(){
	var st = speedtest({maxTime: config.speedtestTimeout}),
		logPath = __dirname+config.logDest,
		log = JSON.parse(fs.existsSync(logPath) ? fs.readFileSync(logPath) : '[]');

	st.on('data', data => {
		var results = {
			download: data.speeds.download,
			upload: data.speeds.upload,
			ping: data.server.ping,
			timestamp: new Date()
		};
		if(config.includeServerData) results.server = data.server;
		log.push(results);

		// prune log
		var maxLogLength = config.daysToKeep * config.recordsPerDay;
		if(config.daysToKeep > 0 && log.length > maxLogLength)
			log.length = maxLogLength;

		fs.writeFileSync(__dirname+config.logDest, JSON.stringify(log), 'utf8');
	});
}

// Setup CronJob
try{
	new CronJob(config.updateCron, updateSpeedLog, null, true, config.timezone)
} catch(ex){
	console.log("updateCron pattern is not valid");
}