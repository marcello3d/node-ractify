Ractify
=================

[Browserify 2](https://github.com/substack/node-browserify) + [ractive.js](http://www.ractivejs.org/)

Usage / Examples
----------------

Browserify API usage:
```js
var browserify = require('browserify')
var ractify = require('ractify')

var bundle = browserify()
bundle.transform(ractify)
```

Clientside code:
```js
var Ractive = require('ractive/build/Ractive.runtime')
var ractive = new Ractive({
    el: document.getElementById("foo",
    template: require('./views/foo.ract'),
    data: ...
})
```

Commandline Browserify usage (I haven't actually tried this):
```
$ npm install ractify
$ browserify -t ractify main.js > bundle.js
```


License
-------
Open source software under the [zlib license](LICENSE).