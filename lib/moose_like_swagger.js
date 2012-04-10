var fs = require('fs'),
    lazy = require('lazy'), 
    async = require('async'), 
    path = require('path'),
    yaml = require('js-yaml'),
    file = fs.readFileSync('/Users/Aaron/Sites/andbangapi/views.js'),
    i=0, 
    inSwag=false, 
    swag=[];

function makeSwagger(file, swag_delim, outdir, done) {

    async.forEach(file.split("\n"), function (line, loopDone) {
        if (line.match(swag_delim)) {
            inSwag = !inSwag;
        } else {
            if (inSwag) {
                swag.push(line);
            }
        }
        loopDone();
    }, function () {
        var apis = [], yaml_docs = swag.join("\n");
        try {
            yaml.loadAll(yaml_docs, function (doc) {
                var meta = doc.swaggerMeta,
                    outfile = meta.name;
                if (!~outfile.indexOf('resources')) {
                    apis.push({
                        path: "/" + outfile.replace(/json$/, "{format}"),
                        description: meta.description
                    })
                } else {
                    doc.apis = apis;
                }
                delete doc.swaggerMeta;
                console.log(meta);
                fs.writeFile(path.join(outdir, outfile), 
                    JSON.stringify(doc, null, 2), 
                    function writeCb(err) {
                        if (err) return done(err);
                        done(null);
                    });
            });
        } catch (e) {
            done(e);
        }
    });
}

exports.makeSwagger = makeSwagger;