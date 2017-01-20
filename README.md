# Automated Speedtest + Log Chart
This package allows you to automatically log speedtests to prove how shitty your ISP really is and hopefully find a solution together with them.

If you have a NAS this is as easy as 'setup and forget', as the NAS will most likely run all the time and thus allow you to do speedtests at your desired frequence without having to turn on your PC or Mac.

## Live Demo

[http://nas.dasblattwerk.at:8080/drei/](http://nas.dasblattwerk.at:8080/drei/)

![Screenshot](https://raw.githubusercontent.com/kitsunekyo/internet-speed-log/master/img/screenshot.jpg)

## Requirements
* nodejs installed

## Installation
Clone the repository
```
git clone https://github.com/kitsunekyo/internet-speed-log
```
Install the npm packages
```
cd internet-speed-log
npm install
```

## Usage
Start the http-server

```
node server.js
```
This will start a http-server on port 8000 (unless you've changed that in the config).

You can then navigate to http://localhost:8000 and view the index.html

### Usage with NAS

To prevent your server from shutting down when you close you SSH session, install the `forever` npm package
```
npm install -g forever
```
Then run the server with `forever`
```
forever server.js
```

## Optional Configuration

| Property   			| Description                    						|
|-----------------------|-------------------------------------------------------|
| `port` 				| The port you'd like your server to run on 			|
| `locale`				| The locale you'd like to use for date/time display 	|
| `logDest`				| The destination for your log file						|
| `updateCron`			| The cron for how often you'd like the speedtest to run|
| `timezone`			| The timezone your jobs should be based on				|
| `speedtestTimeout`	| How long to wait for speedtest.net before canceling	|
| `includeServer`		| Should the server used to test the speed be logged	|
| `daysToKeep`			| The number of days of logs you'd like to keep			|
| `recordsPerDay`		| How many records expected per day (for pruning)		|