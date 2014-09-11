var through = require('through')
var toSource = require('tosource')

var rcu = require('rcu/rcu.node')

rcu.init(require('ractive'))

module.exports = function(file, options) {
    var ext = options && options.extension
        ? options.extension
        : 'ract';

    if (!new RegExp('\\.' + ext + '$', 'i').test(file)) {
        return through()
    }

    var source = ''
    var stream = through(
        function write(buf) {
            source += buf
        },
        function end() {
            try {
                var component = rcu.parse(source)

                var script = ['var component = module']

                if (component.script) {
                    script.push(component.script)
                }
                if (component.template) {
                    script.push('component.exports.template = '+toSource(component.template))
                }
                if (component.css) {
                    script.push('component.exports.css = '+toSource(component.css))
                }
                if (component.imports.length > 0) {
                    script.push('var __beforeInit = component.exports.beforeInit')
                    script.push('component.exports.beforeInit = function(options) {')
                    script.push('if (!options.components) options.components = {}')
                    component.imports.forEach(function(imp) {
                        var component = "options.components['" + imp.name + "']";
                        script.push('if (!' + component + ') ' + component + " = Ractive.extend(require('./" + imp.href + "'))")
                    })
                    script.push('__beforeInit && __beforeInit(options)')
                    script.push('}')
                }
                this.queue(script.join('\n\n'))
                this.queue(null)
            } catch (ex) {
                stream.emit('error', ex)
            }
        }
    )
    return stream
};
