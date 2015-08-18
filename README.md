# Hubot test helper

[![Build Status](https://travis-ci.org/mtsmfm/hubot-test-helper.svg?branch=master)](https://travis-ci.org/mtsmfm/hubot-test-helper)

## Install

`npm install hubot-test-helper --save-dev`

## Usage

If you have a following hubot script:

```coffee
module.exports = (robot) ->
  robot.respond /hi$/i, (msg) ->
    msg.reply 'hi'
```

You can test it like:

```coffee
Helper = require('hubot-test-helper')
# helper loads all scripts passed a directory
helper = new Helper('./scripts')

# helper loads a specific script if it's a file
scriptHelper = new Helper('./scripts/specific-script.coffee')

co     = require('co')
expect = require('chai').expect

describe 'hello-world', ->

  beforeEach ->
    @room = helper.createRoom()

  afterEach ->
    @room.destroy()

  context 'user says hi to hubot', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot hi'
        yield @room.user.say 'bob',   '@hubot hi'

    it 'should reply to user', ->
      expect(@room.messages).to.eql [
        ['alice', '@hubot hi']
        ['hubot', '@alice hi']
        ['bob',   '@hubot hi']
        ['hubot', '@bob hi']
      ]
```

#### HTTPD

By default Hubot enables a built in HTTP server. The server continues between
tests and so requires it to be shutdown during teardown using `room.destroy()`.

This feature can be turned off in tests that don't need it by passing using
`helper.createRoom(http: false)`.

See [the tests](test/httpd-world_test.coffee) for an example of testing the
HTTP server.
