Helper = require('../src/index')
helper = new Helper('./scripts')
http = require('http')

expect = require('chai').expect

process.env.EXPRESS_PORT = 8080

describe 'hello-world', ->
  beforeEach ->
    @room = helper.createRoom()

  afterEach ->
    @room.destroy()

  context 'GET /hello/world', ->
    beforeEach (done) ->
      http.get 'http://localhost:8080/hello/world', (@response) => done()
      .on 'error', done

    it 'responds with status 200', ->
      expect(@response.statusCode).to.equal 200
