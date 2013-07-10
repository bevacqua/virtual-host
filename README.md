# virtual-host

Create virtual, self-contained `connect` or `express` applications using a very simple API.

## Install

Use `npm`

```bash
$ npm install virtual-host --save
```

Require

```js
var vhost = require('virtual-host')(express);
```

You can also `require` it with `connect`, if you are not using `express`.

## API

### #vhost(hostname)

Creates an instance of `express` (or `connect`), and a middleware you can `.use` in your main application.

You can provide a `hostname`, which defaults to `'*'`, to further restrict the hostnames the virtual server will be used on. `hostname` is used to build a regular expression to test against `req.headers.host`, after stripping out the `port`. Stars `'*'` will be converted to `(.*)`. You can use any characters in this set: `[A-z_0-9.*-]`.

You can also just use a `RegExp` object as a `hostname` directly.

Example hostnames:

```js
vhost('*')                // results in /^(.*)$/
vhost('*.foo.com')        // results in /^(.*)\.foo\.com$/i
vhost('www.*.com')        // results in /^www\.(.*)\.com$/i
vhost(/^www\.foo\.com$/i) // results in /^www\.foo\.com$/i
```

### #vhost(hostname).off

Turns off the middleware, it will automatically `.next` all future requests.

```js
var express = require('express');
var vhost = require('virtual-host')(express);
var www = vhost('www.*');

// configure www

app.use(www);

somethingBadHappens(function(){
    www.off(); // disable www
});
```

### #vhost(hostname).on

Turns on the middleware, it will start handling requests once again.

```js
var express = require('express');
var vhost = require('virtual-host')(express);
var www = vhost('www.*');

// configure www

app.use(www);

somethingGoodHappens(function(){
    www.on(); // re-enable www
});
```

### #vhost(hostname).server

Exposes the `express` or `connect` instance used by this `vhost`.

## Usage

```js
var express = require('express');
var vhost = require('virtual-host')(express);
var app = express();
var www = vhost('www.*');

www.use(function(req,res,next){
    console.log(req.url);

    if(req.url === '/off'){
        www.off();
        res.send(500);
    }else{
        res.send(200);
    }    
});

app.use(www);
```