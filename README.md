# Hubot test helper

[![Build Status](https://travis-ci.org/mtsmfm/hubot-test-helper.svg?branch=master)](https://travis-ci.org/mtsmfm/hubot-test-helper)

Helper for testing Hubot script.

## Install

`npm install hubot-test-helper --save-dev`

## Usage

If you have a following hubot script:

```javascript
module.exports = robot =>
  robot.respond(/hi$/i, msg => msg.reply('hi'))
```

You can test it like:

```javascript
const Helper = require('hubot-test-helper');
// helper loads all scripts passed a directory
const helper = new Helper('./scripts');

// helper loads a specific script if it's a file
const scriptHelper = new Helper('./scripts/specific-script.js');

const co     = require('co');
const expect = require('chai').expect;

describe('hello-world', function() {
  beforeEach(function() {
    this.room = helper.createRoom();
  });
  afterEach(function() {
    this.room.destroy();
  });

  context('user says hi to hubot', function() {
    beforeEach(function() {
      return co(function*() {
        yield this.room.user.say('alice', '@hubot hi');
        yield this.room.user.say('bob',   '@hubot hi');
      }.bind(this));
    });

    it('should reply to user', function() {
      expect(this.room.messages).to.eql([
        ['alice', '@hubot hi'],
        ['hubot', '@alice hi'],
        ['bob',   '@hubot hi'],
        ['hubot', '@bob hi']
      ]);
    });
  });
});
```

#### HTTPD

By default Hubot enables a built in HTTP server. The server continues between
tests and so requires it to be shutdown during teardown using `room.destroy()`.

This feature can be turned off in tests that don't need it by passing using
`helper.createRoom(httpd: false)`.

See [the tests](test/httpd-world_test.js) for an example of testing the
HTTP server.


#### Manual delay

Sometimes we can't access callback actions from a script.
Just like in real use-case we may have to wait for a bot to finish processing before replying,
in testing we may anticipate the delayed reply with a manual time delay.

For example we have the following script:

```javascript
module.exports = robot =>
  robot.hear(/(http(?:s?):\/\/(\S*))/i, res => {
    const url = res.match[1];
    res.send(`ok1: ${url}`);
    robot.http(url).get()((err, response, body) => res.send(`ok2: ${url}`));
  });
```

To test the second callback response "ok2: ..." we use the following script:

```javascript
const Helper = require('hubot-test-helper');
const helper = new Helper('../scripts/http.js');

const Promise = require('bluebird');
const co      = require('co');
const expect  = require('chai').expect;

// test ping
describe('http', function() {
  beforeEach(function() {
    this.room = helper.createRoom({httpd: false});
  });

  // Test case
  context('user posts link', function() {
    beforeEach(function() {
      return co(function*() {
        yield this.room.user.say('user1', 'http://google.com');
        // delay one second for the second
        // callback message to be posted to @room
        yield new Promise.delay(1000);
      }.bind(this));
    });

    // response
    it('expects deplayed callback from ok2', function() {
      console.log(this.room.messages);
      expect(this.room.messages).to.eql([
        ['user1', 'http://google.com'],
        ['hubot', 'ok1: http://google.com'],
        ['hubot', 'ok2: http://google.com']
      ]);
    });
  });
});
```

Note that `yield` and *generators* are part of [**ECMA6**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*), so it may not work on older node.js versions. It will wait for the delay to complete the `beforeEach` before proceeding to the test `it`.


#### Testing messages sent to other rooms

You can also test messages sent by your script to other rooms through Hubot's `robot.messageRoom(...)` method.

Given the following script:
```javascript
module.exports = robot =>
  robot.respond(/announce otherRoom: (.+)$/i, msg => {
    robot.messageRoom('otherRoom', "@#{msg.envelope.user.name} said: #{msg.msg.match[1]}");
  })
```

you could test the messages sent to other rooms like this:
```javascript
const Helper = require('../src/index');
const helper = new Helper('../scripts/message-room.js');

const expect = require('chai').expect;

describe('message-room', function() {
  beforeEach(function() {
    this.room = helper.createRoom({name: 'room', httpd: false});
  });

  context('user asks hubot to announce something', function() {
    beforeEach(function() {
      return co(function*() {
        yield this.room.user.say('alice', '@hubot announce otherRoom: I love hubot!');
      }.bind(this));
    });

    it('should not post to this channel', function() {
      expect(this.room.messages).to.eql([
        ['alice', '@hubot announce otherRoom: I love hubot!']
      ]);
    });

    it('should post to the other channel', function() {
      expect(this.room.robot.messagesTo['otherRoom']).to.eql([
        ['hubot', '@alice says: I love hubot!']
      ]);
    });
  });
});
```


#### Testing events

You can also test events emitted by your script.  For example, Slack users
may want to test the creation of a
[message attachment](https://api.slack.com/docs/attachments).

Given the following script:

```javascript
module.exports = robot =>
  robot.respond(/check status$/i, msg =>
    robot.emit('slack.attachment', {
      message: msg.message,
      content: {
        color: "good",
        text: "It's all good!"
      }
    })
  )
```

you could test the emitted event like this:

```javascript
const Helper = require('hubot-test-helper');
const helper = new Helper('../scripts/status_check.js');

const expect = require('chai').expect;

describe('status check', function() {
  beforeEach(function() {
    this.room = helper.createRoom({httpd: false});
  });

  it('should send a slack event', function() {
    let response = null;
    this.room.robot.on('slack.attachment', event => response = event.content);

    this.room.user.say('bob', '@hubot check status').then(() => {
      expect(response.text).to.eql("It's all good!");
    });
  });
});
```

## Development

### Requirements

- docker
- docker-compose

### Setup

```
git clone https://github.com/mtsmfm/hubot-test-helper
cd hubot-test-helper
docker-compose up -d
docker-compose exec app bash
yarn install
```

### Run test

```
yarn run test
```

#### Debug

```
yarn run test-unit-debug
```

Above command will output:

```
yarn run v0.18.1
$ mocha --inspect --debug-brk --compilers coffee:coffee-script/register test
Debugger listening on port 9229.
Warning: This is an experimental feature and could change at any time.
To start debugging, open the following URL in Chrome:
    chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/59631086-0a0c-424b-8f5b-8828be123894
```

Then open `chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/59631086-0a0c-424b-8f5b-8828be123894` in Chrome.
