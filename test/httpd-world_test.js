'use strict';

const Helper = require('../src/index');
const http = require('http');

const { expect } = require('chai');

const helper = new Helper('./scripts/httpd-world.js');

process.env.EXPRESS_PORT = '8080';

describe('httpd-world', () => {
  let room;
  let response;

  beforeEach(async () => {
    room = await helper.createRoom({httpd: true});
  });

  afterEach(() => {
    room.destroy();
  });

  context('GET /hello/world', () => {
    beforeEach(async() => {
      await new Promise((resolve) => {
        http.get('http://localhost:8080/hello/world', res => {
          response = res;
          resolve();
        }).on('error', resolve);
      });
    });

    it('responds with status 200', function() {
      expect(response.statusCode).to.equal(200);
    });
  });
});
