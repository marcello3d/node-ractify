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
test('test.ract', function(done) {
    getTransformedOutput(__dirname+"/test.ract", function(error, output) {
        assert.ifError(error)
        assert.equal(output, fs.readFileSync('test/test.ract-output', 'utf8'))
        done()
    })
})


test('test2.ract', function(done) {
    getTransformedOutput(__dirname+"/test2.ract", function(error, output) {
        assert.ifError(error)
        assert.equal(output, fs.readFileSync('test/test2.ract-output', 'utf8'))
        done()
    })
})

test('Clock-component.ract', function(done) {
    getTransformedOutput(__dirname+"/Clock-component.ract", function(error, output) {
        assert.ifError(error)
        assert.equal(output, fs.readFileSync('test/Clock-component.ract-output', 'utf8'))
        done()
    })
})

test('bad.ract', function(done) {
    getTransformedOutput(__dirname+"/bad.ract", function(error, output) {
        assert.ok(error)
        assert.equal(error.toString(), 'ParseError: Expected closing delimiter \'}}\' after reference at line 1 character 12:\n{{#inverse Unexpected\n           ^----')
        done()
    })
})