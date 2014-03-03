request     = require 'request'
fs          = require('fs')
path        = require('path')

chai        = require('chai')
sinon       = require("sinon")
sinonChai   = require("sinon-chai")
chai.should()
chai.use(sinonChai)

Server      = require '../server.js'
mockDao     = require './mockDao.js'
mockPI      = require './mockPushInterface.js'
savePath    = '/usr/local/legerUploads/'


testServer  = new Server(mockDao, mockPI, 10, savePath)


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
        sinon.spy(mockPI, 'push')
        request.post uri:'http://localhost:8888/post_thread', json:true, form:{title:'foobar',color:'rgb(1,2,3)', policeName:'dragon',policeSize:'24px', imageUrl:'dummyImageUrl'}, (err, res, body) ->
            mockPI.push.should.have.been.calledWith 'newfalope', sinon.match.string
            res.statusCode.should.equal 200
            body.should.be.a 'object'
            body.should.have.property 'id'
            body.id.should.not.be.undefined
            body.should.have.property 'comments'
            body.should.have.property 'color', 'rgb(1,2,3)',
            body.should.have.property 'policeName', 'dragon',
            body.should.have.property 'policeSize', '24px',
            body.should.have.property 'title', 'foobar'
            body.should.have.property 'imageUrl', 'dummyImageUrl'
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

    it 'should save image when uploading one', (done) ->
        save_image = request.post uri:'http://localhost:8888/save_image', json:true, (err, res, body) ->
            res.statusCode.should.equal 200
            body.should.be.a 'object'
            body.should.have.property 'imageUrl'
            body.imageUrl.indexOf('/').should.equal -1
            filename = body.imageUrl.substring 1+body.imageUrl.lastIndexOf '/' 

            #server is fast but not THAT fast to write file to disk, so we wait 500ms
            setTimeout ( ->
                exists = fs.existsSync(savePath+filename)
                exists.should.equal true

                # comparing file bulk size, that is the blocksize for fs i/o
                statLocal = fs.statSync path.join __dirname, 'resources/ohlavache.png'
                statUploaded = fs.statSync(savePath+filename)
                statLocal.blksize.should.equal statUploaded.blksize

                done()
                ),500
        form = save_image.form();
        form.append 'image', fs.createReadStream path.join __dirname, 'resources/ohlavache.png'

    it 'should have an url for upload image', (done) ->
        testServer._savePath = path.join __dirname, 'resources/'
        randomSave = ((Math.random()*2000)+'').replace('.','')

        request uri:'http://localhost:8888/1234567890.png', (err, res, body) ->
            
            statRemote = fs.statSync path.join __dirname, 'resources/1234567890.png'
            statFetched = fs.statSync path.join __dirname, 'resources/tmp/'+randomSave+'.png'
            statFetched.blksize.should.equal statRemote.blksize

            fs.unlink 'tests/resources/tmp/'+randomSave+'.png'
            testServer._savePath = '/usr/local/legerUploads/'
            done()
        .pipe(fs.createWriteStream 'tests/resources/tmp/'+randomSave+'.png' )

    it 'should have an url for thumb image even when not create', (done) ->
        testServer._savePath = path.join __dirname, 'resources/'
        randomSave = ((Math.random()*2000)+'').replace('.','')+'_thumb'
        
        if fs.existsSync path.join __dirname, 'resources/1234567890_thumb.png'
            fs.unlinkSync path.join __dirname, 'resources/1234567890_thumb.png' 
        
        request uri:'http://localhost:8888/1234567890.png/thumb', (err, res, body) ->
            
            statRemote = fs.statSync path.join __dirname, 'resources/1234567890_thumb.png'
            statFetched = fs.statSync path.join __dirname, 'resources/tmp/'+randomSave+'.png'
            statFetched.blksize.should.equal statRemote.blksize

            fs.unlink 'tests/resources/tmp/'+randomSave+'.png'
            testServer._savePath = '/usr/local/legerUploads/'
            done()
        .pipe(fs.createWriteStream 'tests/resources/tmp/'+randomSave+'.png' )


    after ->
        testServer.close()
        
