var through = require('through')
var toSource = require('tosource')

var parseComponentDefinition = require('./vendor/parseComponentDefinition')

module.exports = function(file) {
    if (!/\.ract$/.test(file)) {
        return through()
    }

    var source = ''
    var stream = through(
        function write(buf) {
            source += buf
        },
        function end() {
            try {
                var component = parseComponentDefinition(source);

                var script
                if (component.script || component.imports.length) {
                    script = [ 'var component = module' ]
                    if (component.script) {
                        script.push(component.script)
                    }
                    if (component.template) {
                        script.push('component.exports.template = '+toSource(component.template))
                    }
                    if (component.css) {
                        script.push('component.exports.css = '+toSource(component.css))
                    }
                    if (component.imports.length) {
                        script.push('component.exports.components = {}')
                        component.imports.forEach(function (comp) {
                            script.push('component.exports.components[\'' + comp.name + '\'] = Ractive.extend(require(\'' + comp.href + '\'));')
                        })
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