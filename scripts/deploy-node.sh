cd ..
tar -cf a.tar server/main.js server/modozone.html server/daoMongo.js server/server.js server/pushInterface.js server/package.json server/tests/mockDao.js

scp a.tar marcelfalliere@62.210.237.246:/home/marcelfalliere/

ssh -t marcelfalliere@62.210.237.246 'cd /home/marcelfalliere/;  tar -xf a.tar; cp server/main.js node_server/; cp server/modozone.html node_server/; cp server/daoMongo.js node_server/; cp server/server.js node_server/; cp server/package.json node_server/; cp server/pushInterface.js node_server/pushInterface.js ; cp server/tests/mockDao.js node_server/tests/; rm -rf server/; rm a.tar; forever restart lRVS'

rm a.tar