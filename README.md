# Hubot test helper

[![Build Status](https://travis-ci.org/mtsmfm/hubot-test-helper.svg?branch=master)](https://travis-ci.org/mtsmfm/hubot-test-helper)

Helper for testing Hubot script.

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
`helper.createRoom(httpd: false)`.

See [the tests](test/httpd-world_test.coffee) for an example of testing the
HTTP server.


#### Manual delay

Sometimes we can't access callback actions from a script.
Just like in real use-case we may have to wait for a bot to finish processing before replying,
in testing we may anticipate the delayed reply with a manual time delay.

For example we have the following script:

```coffee
module.exports = (robot) ->
  robot.hear /(http(?:s?):\/\/(\S*))/i, (res) ->
    url = res.match[1]
    res.send "ok1: #{url}"
    robot.http(url).get() (err, response, body) ->
      res.send "ok2: #{url}"
```

To test the second callback response "ok2: ..." we use the following script:

```coffee
Helper = require('hubot-test-helper')
helper = new Helper('../scripts/http.coffee')

Promise= require('bluebird')
co     = require('co')
expect = require('chai').expect

# test ping
describe 'http', ->
  beforeEach ->
    @room = helper.createRoom(httpd: false)

  # Test case
  context 'user posts link', ->
    beforeEach ->
      co =>
        yield @room.user.say 'user1', 'http://google.com'
        # delay one second for the second
        # callback message to be posted to @room
        yield new Promise.delay(1000)

    # response
    it 'expects deplayed callback from ok2', ->
      console.log @room.messages
      expect(@room.messages).to.eql [
        ['user1', 'http://google.com']
        ['hubot', 'ok1: http://google.com']
        ['hubot', 'ok2: http://google.com']
      ]
```

Note that `yield` and *generators* are part of [**ECMA6**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*), so it may not work on older node.js versions. It will wait for the delay to complete the `beforeEach` before proceeding to the test `it`.


#### Testing events

You can also test events emitted by your script.  For example, Slack users
may want to test the creation of a
[message attachment](https://api.slack.com/docs/attachments).

Given the following script:

```coffee
module.exports = (robot) ->

  robot.respond /check status$/i, (msg) ->
    robot.emit 'slack.attachment',
      message: msg.message,
      content: {
        color: "good"
        text: "It's all good!"
      }
```

you could test the emitted event like this:

```coffee
Helper = require 'hubot-test-helper'
helper = new Helper('../scripts/status_check.coffee')

expect = require('chai').expect

describe 'status check', ->
  beforeEach ->
    @room = helper.createRoom(httpd: false)

  it 'should send a slack event', ->
    response = null
    @room.robot.on 'slack.attachment', (event) ->
      response = event.content

    @room.user.say('bob', '@hubot check status').then =>
      expect(response.text).to.eql("It's all good!")
```
