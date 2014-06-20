Ractify
=================

[Browserify 2](https://github.com/substack/node-browserify) + [ractive.js](http://www.ractivejs.org/)

v0.4.x
------

I've decided to remove some "magic." Namely:

* Ractify no longer uses `Ractive.extend`
* `require('ractify')` no longer includes the ractive runtime (it throws an error and will be removed in future versions)

ractify still parses Ractive components, but it just returns a plain javascript object with `template` and `css`
properties (and whatever `<script>` code is in the Ractive component). See [this issue](https://github.com/RactiveJS/Ractive/issues/366#issuecomment-36162827)

See test [input](test/Clock-component.ract) and [output](test/Clock-component.ract-output) for an example.

Upgrading from v0.3.x to v0.4.x
-------------------------------

* replace `var Ractive = require('ractify')` with `var Ractive = require('ractive/build/ractive.runtime')`
* For components, replace `var Foo = require('./foo.ract')` with:

```js
var Ractive = require('ractive/build/ractive.runtime')
var Foo = Ractive.extend(require('./foo.ract'))
```

Upgrading from <v0.3.0 to v0.4.x
--------------------------------

* replace `require('ractify')` with `require('ractive/build/ractive.runtime')`
* replace `new Ractive({ template:require('./foo.ract'), ... })` with `new Ractive({ template:require('./foo.ract').template, ... })`

Installation
------------

Ractify does not install Ractive on its own, you must do so yourself (this allows you to update Ractive without an
update to ractify).

Example:

```
npm install --save ractify
npm install --save ractive@0.4.0
```

Usage / Examples
----------------

Browserify API usage:

```js
var browserify = require('browserify')
var ractify = require('ractify')

var bundle = browserify()
bundle.transform(ractify)
```

In your Client-side JavaScript, `require('ractive/build/ractive.runtime')` and it'll import the runtime-only version of
ractive. `require` a `.ract` file, and it will return a plain javascript object with `template` and (if defined) `css`
parameters:

```js
var Ractive = require('ractive/build/ractive.runtime')
var foo = new Ractive({
    template:require('./views/foo.ract').template,
    el: document.getElementById("foo"),
    data: ...
})
```

This structure can be passed into `Ractive.extend` to automatically build Ractive components:

```js
var Ractive = require('ractive/build/ractive.runtime')
var Foo = Ractive.extend(require('./views/foo.ract'))
var foo = new Foo({
    el: document.getElementById("foo"),
    data: ...
})
```

Extract partials by inspecting the `template` property:

```js
var foo = require('./views/partials.ract')
if (foo.template.partials) {
    // foo.template.main has the main template
    // foo.template.partials has the partial templates
}
```

Commandline Browserify usage:
```
$ browserify -t ractify main.js > bundle.js
```

If you want to use different file extension, e.g. ```.html```, you can use ```extension``` option:

```js
var browserify = require('browserify');
var ractify = require('ractify');

var bundle = browserify();
bundle.transform({ extension: 'html' }, ractify);
```

```
$ browserify -t [ ractify --extension html ] main.js > bundle.js
```

License
-------
Open source software under the [zlib license](LICENSE).