#!/bin/bash -eu

mkdir -p done

for i in $(ls toDelete_*)
do
	echo ----------BEGIN $(date) ---------------------
	echo Deleting $i content
	node getTokens.js | grep Number
	cp $i toDelete.lst
	time node \!deleteTokens.js
	node getTokens.js | grep Number
	mv $i done
	echo end of $i
	echo ---------- END $(date) ---------------------
done
