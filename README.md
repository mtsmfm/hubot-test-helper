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

expect = require('chai').expect

describe 'hello-world', ->

  beforeEach ->
    @room = helper.createRoom()

  context 'user says hi to hubot', ->
    beforeEach ->
      @room.user.say 'alice', '@hubot hi'
      @room.user.say 'bob',   '@hubot hi'

    it 'should reply to user', ->
      expect(@room.messages).to.eql [
        ['alice', '@hubot hi']
        ['hubot', '@alice hi']
        ['bob',   '@hubot hi']
        ['hubot', '@bob hi']
      ]
```
