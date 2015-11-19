# Portal token tools

This is some basics tools to interact with the portal tokens. It uses **crash** to interact with platform.

These tools are pretty basics and need to be extended to avoid manual actions to exploit their results.

## Requirements

* Nodejs >= 0.12

## Installation

* Clone this repository
* Install required module
```
npm install telnet-client
```
* Update username and password on .js files
```
var user        = 'CHANGEME';
var password    = 'CHANGEME';
```

## Get the tokens
* Execute
```
node getTokens.js
```
The result is store in the file ``tokens.lst`` on the project directory.

For example :
```
+-/autologin/-mXqadHQQkmu
+-/autologin/-GBudpSv-E-P
+-/autologin/-OxvseK-mnNO
+-/autologin/-pvCgNZJSBCf
+-/autologin/-TdIbEOGIhpl
```

## Get the details of the tokens
* Execute
```
node getTokenDetails.js
```
This command take the ``tokens.lst`` generated by the previous command and create a csv file ``details.csv`` with the following informations :

```
id;uuid;"expiration date";"user name","date create";owner
QIr6RC4bsE7F;'acfa48d0a772acc419cf0892ac7d8030';2015-11-04T06:44:55.246+01:00;'user';2015-10-28T06:44:55.275+01:00;'__system';
```

## Remove tokens
* Execute
```
node \!deleteTokens.js
```
This command read a list of tokens in the file ``toDelete.lst`` in the current directory and remove them.

## Batch removal
You can generate several files containing ids named ``toDetete_<something>`` and execute the command

```
# ./batchDelete.sh
```