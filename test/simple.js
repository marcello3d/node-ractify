var assert = require('assert')
var fs = require('fs')

var handleify = require('../index.js')

suite('Simple')

function getTransformedOutput(filename, callback) {
    var pipe = handleify(filename)
    var output = ''
    fs.createReadStream(filename).pipe(pipe)
    pipe.on('error', function (error) {
            callback(error)
        })
        .on('data', function (data) {
            output += data
        })
        .on('end', function () {
            callback(null, output)
        })
}
test('test.hbs', function(done) {
    getTransformedOutput(__dirname+"/test.ract", function(error, output) {
        assert.ifError(error)
        assert.equal(output, 'module.exports=["Hello ",{t:2,r:"world"},"!"]')
        done()
    })
})

test('bad.hbs', function(done) {
    getTransformedOutput(__dirname+"/bad.ract", function(error, output) {
        assert.ok(error)
        assert.equal(error.toString(), 'Error: Tokenizer failed: unexpected string "Unexpected" (expected "}}")')
        done()
    })
})
