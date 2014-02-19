request     = require 'request'
Server      = require '../server.js'
mockDao     = require './mockDao.js'
should      = require('chai').should()
testServer  = new Server(mockDao, 10)

describe 'Server ', ->

    before ->
        testServer.listen 8888

    it 'should return 10 secrets', (done) ->
        request uri:'http://localhost:8888/threads', json:true, (err, res, body) ->
            res.statusCode.should.equal 200
            body.should.be.a 'array'
            body.should.have.property 'length', 10
            thread.should.have.property 'id' for thread in body
            thread.should.have.property 'title' for thread in body
            thread.should.have.property 'count_comments' for thread in body
            thread.should.not.have.property 'comments' for thread in body
            body[0].id.should.equal '1'
            done()
    
    it 'should return 404 if non existing', (done) ->
        request 'http://localhost:8888/threads/11', (err, res, body) ->
            res.statusCode.should.equal 404
            done()

    it 'should return the details of a thread', (done) ->
        request uri:'http://localhost:8888/threads/2', json:true, (err, res, body) ->
            res.statusCode.should.equal 200
            body.should.be.a 'object'
            body.should.have.property 'id', '2'
            body.should.have.property 'comments'
            body.comments.should.be.a 'array'
            body.comments.should.be.empty
            done()

    it 'should be able to post a comment', (done) ->
        request.post uri:'http://localhost:8888/threads/2/post_comment', json:true, form:{text:'test'}, (err,res,body) ->
            res.statusCode.should.equal 200
            body.should.be.a 'object'
            body.should.have.property 'id', '2'
            body.should.have.property 'comments'
            body.comments.should.be.a 'array'
            body.comments.should.have.property 'length', 1
            body.comments[0].should.have.property 'text'
            body.comments[0].text.should.equal 'test'
            done()

    it 'should have thread 2 in position 0', (done) ->
        request uri:'http://localhost:8888/threads', json:true, (err, res, body) ->
            res.statusCode.should.equal 200
            body.should.be.a 'array'
            body.should.have.property 'length', 10
            body[0].id.should.equal '2'
            body[1].id.should.equal '1'
            body[2].id.should.equal '3'
            done()

    it 'should reorder and limit when posting a new thread', (done) ->
        request.post uri:'http://localhost:8888/post_thread', json:true, form:{title:'foobar',color:'rgb(1,2,3)'}, (err, res, body) ->
            res.statusCode.should.equal 200
            body.should.be.a 'object'
            body.should.have.property 'id'
            body.id.should.not.be.undefined
            body.should.have.property 'comments'
            body.should.have.property 'color', 'rgb(1,2,3)',
            body.should.have.property 'title', 'foobar'
            body.comments.should.be.a 'array'
            body.comments.should.have.property 'length', 0
            done()

    it 'shoud have thread a)101 b)2 c)1 d)3 e)4 and 10 threads ', (done) ->
        request uri:'http://localhost:8888/threads', json:true, (err, res, body) ->
            res.statusCode.should.equal 200
            body.should.be.a 'array'
            body.should.have.property 'length', 10
            body[0].id.should.equal '101'
            body[1].id.should.equal '2'
            body[2].id.should.equal '1'
            body[3].id.should.equal '3'
            body[4].id.should.equal '4'
            done()

    after ->
        testServer.close()
        
