// Based on https://github.com/RactiveJS/requirejs-ractive/blob/master/rvc-src/utils/parseComponentDefinition.js

var Ractive = require('ractive')


var requirePattern = /require\s*\(\s*(?:"([^"]+)"|'([^']+)')\s*\)/g;


function extractFragment(item) {
    return item.f;
}
function getName(path) {
    var pathParts = path.split( '/' );
    var filename = pathParts.pop();

    var lastIndex = filename.lastIndexOf( '.' );
    if ( lastIndex !== -1 ) {
        filename = filename.substr( 0, lastIndex );
    }

    return filename;
}

module.exports = function(source) {
    var template = Ractive.parse(source, {
        noStringify: true,
        interpolateScripts: false,
        interpolateStyles: false
    });

    var links = [];
    var scripts = [];
    var styles = [];
    var modules = [];

    // Extract certain top-level nodes from the template. We work backwards
    // so that we can easily splice them out as we go
    var i = template.length;
    while ( i-- ) {
        var item = template[i];

        if ( item && item.t === 7 ) {
            if ( item.e === 'link' && ( item.a && item.a.rel[0] === 'ractive' ) ) {
                links.push( template.splice( i, 1 )[0] );
            }

            if ( item.e === 'script' && ( !item.a || !item.a.type || item.a.type[0] === 'text/javascript' ) ) {
                scripts.push( template.splice( i, 1 )[0] );
            }

            if ( item.e === 'style' && ( !item.a || !item.a.type || item.a.type[0] === 'text/css' ) ) {
                styles.push( template.splice( i, 1 )[0] );
            }
        }
    }

    // Extract names from links
    var imports = links.map( function(link) {
        var href = link.a.href && link.a.href[0];
        var name = ( link.a.name && link.a.name[0] ) || getName( href );

        if ( typeof name !== 'string' ) {
            throw new Error( 'Error parsing link tag' );
        }

        return {
            name: name,
            href: href
        };
    });

    var script = scripts.map( extractFragment ).join( ';' );

    var match;
    while ((match = requirePattern.exec( script )) !== null) {
        modules.push( match[1] || match[2] );
    }

    // TODO glue together text nodes, where applicable

    return {
        template: template,
        imports: imports,
        script: script,
        css: styles.map( extractFragment ).join( ' ' ),
        modules: modules
    };
}