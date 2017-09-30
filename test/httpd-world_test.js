/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Helper = require('../src/index');
const helper = new Helper('./scripts');
const http = require('http');

const { expect } = require('chai');

process.env.EXPRESS_PORT = 8080;

describe('httpd-world', function() {
  beforeEach(function() {
    return this.room = helper.createRoom();
  });

  afterEach(function() {
    return this.room.destroy();
  });

  return context('GET /hello/world', function() {
    beforeEach(function(done) {
      return http.get('http://localhost:8080/hello/world', response => { this.response = response; return done(); })
      .on('error', done);
    });

    return it('responds with status 200', function() {
      return expect(this.response.statusCode).to.equal(200);
    });
  });
});
