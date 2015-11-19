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
  execAndLog('cd autologin', readTokens);
}

function extractTokenDetails(id, content) {
  var buffer = id.trim() + ';';
  var stream = new Readable();

  rl = readLine.createInterface({input: stream});

  rl.on('close', function(){
    csv.write(buffer + '\n');
  });

  rl.on('line', function(line) {
    if ( line.match(/uuid/) ) {
      buffer += line.split(":")[2].trim() + ";";
    } else if ( line.match(/username/)) {
      buffer += line.split(":")[1].trim() + ";";
    } else if ( line.match(/expiration/)) {
      buffer += line.split("n:")[1].trim() + ";";
    } else if ( line.match(/Created/)) {
      buffer += line.split("d:")[1].trim() + ";";
    } else if ( line.match(/owner/)) {
      buffer += line.split(":")[2].trim() + ";";
    }
  });
  stream.push(content);
  stream.push(null);

}
/*
/autologin/dlC3Aqf7LV1u
+-properties
| +-jcr:primaryType: tkn:tokenentry
| +-jcr:mixinTypes: [exo:modify,exo:owneable,exo:datetime,exo:sortable,tkn:hashe
| | dtoken]
| +-jcr:uuid: 'fffffffffffff'
| +-expiration: 2015-09-30T07:08:21.687+02:00
| +-hashedtoken: 'xxxx'
| +-password: 'xxxx'
| +-username: 'user1'
| +-exo:dateCreated: 2015-09-23T07:08:21.704+02:00
| +-exo:dateModified: 2015-09-23T07:08:21.704+02:00
| +-exo:index: 1000
| +-exo:lastModifiedDate: 2015-09-23T07:08:21.706+02:00
| +-exo:lastModifier: '__user'
| +-exo:name: 'dl32AEq7Vd1u'
| +-exo:owner: '__system'
+-children
*/
function getTokenDetail(id) {
  connection.exec('ls ' + id, function(response) {
    extractTokenDetails(id, response);
    readTokens();
  })
}

function readTokens() {
  var token = tokens.pop();
  if (token) {
    done++;
    console.log("getting detail of token " + done + " / " + total);
    getTokenDetail(token);
  } else {
    exit()
  }

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

var done = 0
var total;
var tokens = [];
var csv = fs.createWriteStream('details.csv');
csv.write('id;uuid;"expiration date";"user name","date create";owner\n');

var input = fs.createReadStream('ids');
rl = readLine.createInterface({input: input});
rl.on('line', function(line) {
  tokens.push(line)
});
rl.on('close', function() {
  total = tokens.length;
  console.log("file ids read, " + total + " to process");

  connection.connect(params);
});
