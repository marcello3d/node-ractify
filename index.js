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

                var script
                if (component.script) {
                    script = [
                        'var component = module',
                        component.script
                    ]
                    if (component.template) {
                        script.push('component.exports.template = '+toSource(component.template))
                    }
                    if (component.css) {
                        script.push('component.exports.css = '+toSource(component.css))
                    }
                    this.queue(script.join('\n\n'))
                } else {
                    script = []
                    script.push('exports.template = '+toSource(component.template))
                    if (component.css) {
                        script.push('exports.css = '+toSource(component.css))
                    }
                    this.queue(script.join('\n\n'))
                }

                this.queue(null)
            } catch (ex) {
                stream.emit('error', ex)
            }
        }
    )
    return stream
};