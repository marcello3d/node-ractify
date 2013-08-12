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

In your Client-side JavaScript you can include just the runtime version of Ractive. When you `require` a .ract file,
ractify will parse it and export the pre-parsed array:
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
$ npm install ractify ractive
$ browserify -t ractify main.js > bundle.js
```


License
-------
Open source software under the [zlib license](LICENSE).