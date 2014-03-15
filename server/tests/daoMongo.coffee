EasyMongo 	= require('easymongo')

chai        = require('chai')
sinon       = require("sinon")
sinonChai   = require("sinon-chai")
chai.should()
chai.use(sinonChai)

DaoMongo	= require '../daoMongo.js'

describe 'DaoMongo ', ->

	afterEach (done) ->
		testDaoMongo = new DaoMongo('dummyDatabase');
		threads = testDaoMongo._mongo.collection 'threads'
		threads.remove {}, () ->
			done()

	it 'should create a mongo instance with options', ->
		testDaoMongo = new DaoMongo('dummyDatabase');
		testDaoMongo.should.have.property '_dbname', 'dummyDatabase'
		testDaoMongo.should.have.property '_mongo'
		return

	it 'should save thread limit size', ->
		testDaoMongo = new DaoMongo('dummyDatabase');
		testDaoMongo.setLimit(123);
		testDaoMongo.should.have.property '_limit', 123
		return

	it 'should have the mockDao functions', ->
		testDaoMongo = new DaoMongo('dummyDatabase');
		testDaoMongo.thread.should.be.a 'function'
		testDaoMongo.threads.should.be.a 'function'
		testDaoMongo.post_thread.should.be.a 'function'
		testDaoMongo.post_comment.should.be.a 'function'
		return

	it 'should transform array of dtos', ->
		testDaoMongo = new DaoMongo('dummyDatabase')
		objs = [{_id:'dummy1', foo:'bar'}, {_id:'dummy2', foo:'bar2'}]
		testDaoMongo._transformMongoId objs
		objs.should.have.property 'length', 2
		obj.should.have.property 'id' for obj in objs
		obj.should.not.have.property '_id' for obj in objs
		obj.should.have.property 'foo' for obj in objs
		return

	it 'should transform a dto', ->
		testDaoMongo = new DaoMongo('dummyDatabase')
		obj = {_id:'dummy1', foo:'bar'}
		testDaoMongo._transformMongoId(obj)
		obj.should.have.property 'id', 'dummy1'
		obj.should.not.have.property '_id'
		obj.should.have.property 'foo', 'bar'
		return




