var through = require('through')
var toSource = require('tosource')

var parseComponentDefinition = require('./vendor/parseComponentDefinition')

module.exports = function(file) {
    if (!/\.ract$/.test(file)) return through()

    var source = ''
    var stream = through(
        function write(buf) { 
            source += buf 
        },
        function end() {
            try {
                var component = parseComponentDefinition(source);

                var script = ['var Ractive = require("ractify");','var component = { exports:{} };']
                if (component.script) {
                    script.push(component.script)
                }
                if (component.template) {
                    script.push('component.exports.template = '+toSource(component.template)+';');
                }
                if (component.css) {
                    script.push('component.exports.css = '+toSource(component.css)+';');
                }
                script.push('module.exports = Ractive.extend(component.exports);')

                this.queue(script.join('\n\n'));
                this.queue(null)
            } catch (ex) {
                stream.emit('error', ex)
            }
        }
    )
    return stream
};