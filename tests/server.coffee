request     = require('request');
Server      = require('../server.js')
mockDao     = require('./mockDao.js')
should      = require('chai').should()
testServer  = new Server(mockDao)

describe 'Server tests', ->

    before ->
        testServer.listen 8888

    it 'should return 10 secrets', (done) ->
        request uri:'http://localhost:8888/threads', json:true, (err, res, body) ->
            res.statusCode.should.equal 200
            body.should.have.property 'length', 10
            done()
        


    after ->
        testServer.close()
        
