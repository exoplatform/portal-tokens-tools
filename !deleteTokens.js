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

var file        = 'toDelete.lst';

function execAndLog(cmd, next) {
  connection.exec(cmd, function(response) {
    console.log(response);

    next()
  });
}

function commit() {
  execAndLog('commit', exit);
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
  execAndLog('cd autologin', deleteTokens);
}

function deleteToken(id) {
  connection.exec('rm ' + id, function(response) {
    deleteTokens();
  })
}

function deleteTokens() {
  var token = tokens.pop();
  if (token) {
    done++;
    console.log("removing token " + done + " / " + total + " " + token);
    deleteToken(token);
  } else {
    commit()
  }

}

function start() {
  useRepo(useWorkspace)
}

connection.on('ready', function(prompt) {
  console.log('ready');

  start()

});

var done = 0
var total;
var tokens = [];

var input = fs.createReadStream('toDelete.lst');
rl = readLine.createInterface({input: input});
rl.on('line', function(line) {
  tokens.push(line)
});
rl.on('close', function() {
  total = tokens.length;
  console.log("ids read, " + total + " to delete");

  connection.connect(params);
});
