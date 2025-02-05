#!/usr/bin/env node

"use strict";

var util = require('util');
var path = require('path');
var fs = require('fs');
var Transform = require('stream').Transform;
var zlib = require("zlib");
var CAF = require('caf');

var args = require("minimist")(process.argv.slice(2), {
    boolean: ["help", "in", "out", "compress", "uncompress"],
    string: ["file"]
});

processFile = CAF(processFile);

function streamComplete() {
    return new Promise(function c(res) {
        stream.on('end', res);

    })
}

var BASE_PATH = path.resolve(
    process.env.BASE_PATH || __dirname
)

var OUTFILE = path.join(BASE_PATH, 'out.txt');

if (args.help) {
    printHelp();
} else if (args.in || args._.includes("-")) {

    let tooLong = CAF.timeout(20, 'Took too long'); // cancellation token that cancels after 3sec

    processFile(tooLong, process.stdin)
        .then(function () {
            console.log('Complete!')
        }).catch(error); // pass stdin stream (readable stream)
} else if (args.file) {

    let stream = fs.createReadStream(path.join(BASE_PATH, args.file)); // make a stream that reads the file

    let tooLong = CAF.timeout(20, 'Took too long'); // cancellation token that cancels after 3sec

    fs.readFile(stream, function onContents(error, contents) {
        if (err) {
            error(err.toString());
        } else {
            processFile(tooLong, contents.toString())
                .then(function () {

                })
                .catch(error);
        }
    });

} else {

    error('Incorrect usage.', true);
}

// ************************

function* processFile(signal, inStream) {

    var outStream = inStream;

    if (args.uncompress) {
        let gunzipstream = zlib.createGunzip();
        outStream = outStream.pipe(gunzipstream)
    }

    // inbetween stream that makes chunks into upperCase 
    var uppserStream = new Transform({
        transform(chunck, enc, next) {
            this.push(chunck.toString().toUpperCase());
            next();
        }
    })

    outStream = outStream.pipe(uppserStream);

    if (args.compress) {
        let gzipStream = zlib.createGzip()
        outStream = outStream.pipe(gzipStream)
        OUTFILE = `${OUTFILE}.gz`
    }

    var tagetStream;
    if (args.out) {
        tagetStream = process.stdout; // writable stream
    } else {
        tagetStream = fs.createWriteStream(OUTFILE);
    }

    outStream.pipe(tagetStream);

    signal.pr.catch(function f() {
        outStream.unpipe(tagetStream);
        outStream.destroy();
    });

    yield streamComplete(outStream);
}

function error(msg, includeHelp = false) {
    console.log(msg);
    if (includeHelp) {
        console.log("");
        printHelp();
    }
}

function printHelp() {
    console.log("ex3 usage:");
    console.log("  ex3 --file={FILENAME}");
    console.log("");
    console.log("--help                      print this help");
    console.log("--file={FILENAME}           process the file");
    console.log("--in, -                     process stdin");
    console.log("--out                       print to stdout");
    console.log("--compress                  gzip the output");
    console.log("--uncompress                un-gzip the output");
    console.log("");
}


