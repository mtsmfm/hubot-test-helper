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
# helper loads all scripts under the directory
helper = new Helper('./scripts')

expect = require('chai').expect

describe 'hello-world', ->
  room = null

  beforeEach ->
    room = helper.createRoom()

  context 'user says hi to hubot', ->
    beforeEach ->
      room.user.say 'alice', '@hubot hi'
      room.user.say 'bob',   '@hubot hi'

    it 'should reply to user', ->
      expect(room.messages).to.eql [
        ['alice', '@hubot hi']
        ['hubot', '@alice hi']
        ['bob',   '@hubot hi']
        ['hubot', '@bob hi']
      ]
```
