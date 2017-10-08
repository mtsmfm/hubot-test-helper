'use strict'

const Helper = require('../src/index');
const helper = new Helper('./scripts');
const http = require('http');

const expect = require('chai').expect;

process.env.EXPRESS_PORT = 8080;

describe('httpd-world', function() {
  beforeEach(function() {
    this.room = helper.createRoom();
  });

  afterEach(function() {
    this.room.destroy();
  });

  context('GET /hello/world', function() {
    beforeEach(function(done) {
      http.get('http://localhost:8080/hello/world', response => {
        this.response = response;
        done();
      }).on('error', done);
    });

    it('responds with status 200', function() {
      expect(this.response.statusCode).to.equal(200);
    });
  });
});
