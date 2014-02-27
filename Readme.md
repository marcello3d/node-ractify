Ractify
=================

[Browserify 2](https://github.com/substack/node-browserify) + [ractive.js](http://www.ractivejs.org/)

Experimental component-based branch
-----------------------------------
Rather than just return the parse from Ractive, this version parses as a Ractive html component with optional style and
script blocks. See [this issue](https://github.com/RactiveJS/Ractive/issues/366#issuecomment-36162827)

As a result the usage changes slightly, but makes it much cleaner to create reusable Ractive-based components.

See test [input](test/Clock-component.ract) and [output](test/Clock-component.ract-output) for an example.

Usage / Examples
----------------

Browserify API usage:
```js
var browserify = require('browserify')
var ractify = require('ractify')

var bundle = browserify()
bundle.transform(ractify)
```

In your Client-side JavaScript, `require('ractfiy')` and it'll import the runtime-only version of ractive. `require` a
`.ract` file, and ractify will parse it and export the pre-parsed array:
```js
var Ractive = require('ractify')
var Foo = require('./views/foo.ract')
var ractive = new Foo({
    el: document.getElementById("foo"),
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