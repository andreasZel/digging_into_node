#!/usr/bin/env node

"use strict";

var utils = require('utils');
var path = require('path');
var fs = require('fs');
var Transform = require('stream').Transform;

var args = require("minimist")(process.argv.slice(2), {
    boolean: ["help", "in", "out"],
    string: ["file"]
});

var BASE_PATH = path.resolve(
    process.env.BASE_PATH || __dirname
)

var OUTFILE = path.join(BASE_PATH, 'out.txt');

if (args.help) {
    printHelp();
} else if (args.in || args._.includes("-")) {

    processFile(process.stdin); // pass stdin stream (readable stream)
} else if (args.file) {

    let stream = fs.createReadStream(path.join(BASE_PATH, args.file)); // make a stream that reads the file

    fs.readFile(stream, function onContents(error, contents) {
        if (err) {
            error(err.toString());
        } else {
            processFile(contents.toString());
        }
    });

} else {

    error('Incorrect usage.', true);
}

// ************************

function processFile(inStream) {

    var outStream = inStream;

    // inbetween stream that makes chunks into upperCase 
    var uppserStream = new Transform({
        transform(chunck, enc, next) {
            this.push(chunck.toString().toUpperCase());
            next();
        }
    })

    outStream = outStream.pipe(uppserStream);

    var tagetStream;
    if (args.out) {
        tagetStream = process.stdout; // writable stream
    } else {
        tagetStream = fs.createWriteStream(OUTFILE);
    }

    outStream.pipe(tagetStream);
}

function error(msg, includeHelp = false) {
    console.log(msg);
    if (includeHelp) {
        console.log("");
        printHelp();
    }
}

function printHelp() {
    console.log("ex2 usage:");
    console.log("");
    console.log("--help                      print this help");
    console.log("--file={FILENAME}           process the file");
    console.log("--in, -                     process stdin");
    console.log("--out                       print tp stdout");
    console.log("");
}


