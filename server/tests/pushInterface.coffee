chai        = require('chai')
sinon       = require("sinon")
sinonChai   = require("sinon-chai")
chai.should()
chai.use(sinonChai)

PushInterface = require '../pushInterface.js'

mockRequest 		= post : (->)
dummyEndPoint		= 'http://dummyEndPoint/'
testPushInterface 	= new PushInterface(mockRequest, dummyEndPoint)

describe 'PushInterface', ->

	it 'should make a post request when pushing', ->
		sinon.spy(mockRequest, 'post')
		testPushInterface.push('dummyEvent', 'dummyMessage')
		mockRequest.post.should.have.been.calledWith
			uri:'http://dummyEndPoint/event/dummyEvent', 
			json:true, 
			form: { msg:'dummyMessage' },
			sinon.match.func