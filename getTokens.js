var telnet      = require('telnet-client');
var connection  = new telnet();
var fs          = require("fs");
var readLine    = require('readline');
var Readable    = require('stream').Readable;

var user        = 'CHANGEME';
var password    = 'CHANGEME';

var params      = {
  host:         '127.0.0.1',
  port:         '10423',
  shellPrompt:  '% '
};

var file = 'tokens.lst';

function execAndLog(cmd, next) {
	connection.exec(cmd, function(response) {
		console.log(response);

		next()
	});
}

function exit() {
	execAndLog('exit');
}

function useRepo(next) {
	execAndLog('repo use container=portal', next);
}

function useWorkspace(next) {
  execAndLog('ws login -u ' + user + ' -p ' + password + ' portal-work', changeDirectory);
}

function changeDirectory(next) {
	execAndLog('cd autologin', extractToken);
}

function extractToken() {
	console.log("Getting token list...");
	connection.exec('ls', function(response) {
		console.log("Token received, parsing response...")
		var count=0;

		// cleaning file
		// fs.writeFile('tokens.lst');
		var write = fs.createWriteStream('tokens.lst');

		var stream = new Readable();

		rl = readLine.createInterface({input: stream});
		rl.on('line', function(line) {
			if ( line.match(/^\s+\+-\/autologin\//) ) {
				count++;
				write.write(line + '\n');
			}
		});
		stream.push(response);
		stream.push(null);

		rl.on('close', function() {
			console.log('Number of tokens : ' + count);
			exit();
		});
	});
}

function start() {
	useRepo(useWorkspace)
}



connection.on('ready', function(prompt) {
	console.log('ready');

	start()

});

connection.connect(params);
