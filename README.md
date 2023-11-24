# Hubot test helper

[![Build Status](https://travis-ci.org/mtsmfm/hubot-test-helper.svg?branch=master)](https://travis-ci.org/mtsmfm/hubot-test-helper)

Helper for testing Hubot script.

## Install

`npm install hubot-test-helper --save-dev`

## Usage

If you have a following hubot script:

```js
module.exports = robot => {
    robot.respond(/hi$/i, msg => {
        msg.reply('hi');
    });
}
```

You can test it like:

```js
const Helper = require('hubot-test-helper');
// helper loads all scripts passed a directory
const helper = new Helper('./scripts');

// helper loads a specific script if it's a file
const scriptHelper = new Helper('./scripts/specific-script.js');

const { expect } = require('chai');

describe('hello-world', () => {
    let room;

    beforeEach(async () => {
        room = await helper.createRoom();
    });
    afterEach(() => {
        room.destroy();
    });

    context('user says hi to hubot', () => {
        beforeEach(async () => {
            await room.user.say('alice', '@hubot hi');
            await room.user.say('bob',   '@hubot hi');
        });

        it('should reply to user', () => {
            expect(room.messages).to.eql([
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

By default, Hubot enables a built-in HTTP server. The server continues between
tests and so requires it to be shutdown during teardown using `room.destroy()`.

This feature is turned off in tests by default but can be turned on by using
```js
helper.createRoom({httpd: true})
```

See [the tests](test/httpd-world_test.js) for an example of testing the
HTTP server.


#### Manual delay

Sometimes we can't access callback actions from a script.
Just like in real use-case we may have to wait for a bot to finish processing before replying,
in testing we may anticipate the delayed reply with a manual time delay.

For example, we have the following script:

```js
module.exports = robot => {
    robot.hear(/(http(?:s?):\/\/(\S*))/i, res => {
        const url = res.match[1];
        res.send(`ok1: ${url}`);
        robot.http(url).get()((err, response, body) => res.send(`ok2: ${url}`));
    });
}
```

To test the second callback response "ok2: ..." we use the following script:

```js
const Helper = require('hubot-test-helper');
const { expect } = require('chai');

const helper = new Helper('./scripts/http.js');

// test ping
describe('http', () => {
    let room;

    beforeEach(async () => {
        room = await helper.createRoom();
    });

    // Test case
    context('user posts link', () => {
        beforeEach(async () => {
            await room.user.say('user1', 'http://google.com');
            // delay one second for the second
            // callback message to be posted to @room
            await new Promise.delay(1000);
        });

        // response
        it('expects deplayed callback from ok2', () => {
            console.log(room.messages);
            expect(room.messages).to.eql([
                ['user1', 'http://google.com'],
                ['hubot', 'ok1: http://google.com'],
                ['hubot', 'ok2: http://google.com']
            ]);
        });
    });
});
```

#### Testing messages sent to other rooms

You can also test messages sent by your script to other rooms through Hubot's `robot.messageRoom(...)` method.

Given the following script:
```js
module.exports = robot => {
    robot.respond(/announce otherRoom: (.+)$/i, msg => {
        robot.messageRoom('otherRoom', `@${msg.envelope.user.name} said: ${msg.msg.match[1]}`);
    });
}
```

you could test the messages sent to other rooms like this:
```js
const Helper = require('hubot-test-helper');
const { expect } = require('chai');

const helper = new Helper('./scripts/message-room.js');

describe('message-room', () => {
    let room;

    beforeEach(async () => {
        room = await helper.createRoom();
    });

    context('user asks hubot to announce something', () => {
        beforeEach(async () => {
            await room.user.say('alice', '@hubot announce otherRoom: I love hubot!');
        });

        it('should not post to this channel', () => {
            expect(room.messages).to.eql([
                ['alice', '@hubot announce otherRoom: I love hubot!']
            ]);
        });

        it('should post to the other channel', () => {
            expect(room.robot.messagesTo['otherRoom']).to.eql([
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

```js
module.exports = (robot) => {
    robot.respond(/check status$/i, msg => {
        robot.emit('slack.attachment', {
            message: msg.message,
            content: {
                color: "good",
                text: "It's all good!"
            }
        });
    });
}
```

you could test the emitted event like this:

```js
const Helper = require('hubot-test-helper');
const { expect } = require('chai');

const helper = new Helper('./scripts/status_check-room.js');

describe('status check', () => {
    let room;

    beforeEach(async () => {
        room = await helper.createRoom();
    });

    it('should send a slack event', () => {
        let response = null;
        room.robot.on('slack.attachment', event => response = event.content);

        room.user.say('bob', '@hubot check status').then(() => {
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

```shell
git clone https://github.com/mtsmfm/hubot-test-helper
cd hubot-test-helper
docker-compose up -d
docker-compose exec app bash
yarn install
```

### Run test

```shell
yarn run test
```

#### Debug

```shell
yarn run test-unit-debug
```

Above command will output:

```shell
yarn run v0.18.1
$ mocha --inspect --debug-brk --compilers coffee:coffee-script/register test
Debugger listening on port 9229.
Warning: This is an experimental feature and could change at any time.
To start debugging, open the following URL in Chrome:
    chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/59631086-0a0c-424b-8f5b-8828be123894
```

Then open `chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/59631086-0a0c-424b-8f5b-8828be123894` in Chrome.
