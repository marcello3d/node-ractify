var Ractive = require('ractive')
var through = require('through')
var toSource = require('tosource')

module.exports = function(file) {
    if (!/\.ract$/.test(file)) return through()

    var source = ''
    var stream = through(
        function write(buf) { 
            source += buf 
        },
        function end() {
            try {
                this.queue('module.exports='+toSource(Ractive.parse(source),null,0))
                this.queue(null)
            } catch (ex) {
                stream.emit('error', ex)
            }
        }
    )
    return stream
};