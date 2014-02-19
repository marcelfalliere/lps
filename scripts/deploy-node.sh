cd ..
tar -cf a.tar server/main.js server/server.js server/package.json server/tests/mockDao.js

scp a.tar marcelfalliere@62.210.237.246:/home/marcelfalliere/

ssh -t marcelfalliere@62.210.237.246 'cd /home/marcelfalliere/;  tar -xf a.tar; forever stop 0; cp server/main.js node_server/; cp server/server.js node_server/; cp server/package.json node_server/; cp server/tests/mockDao.js node_server/tests/; rm -rf server/; rm a.tar; forever start node_server/main.js'

rm a.tar