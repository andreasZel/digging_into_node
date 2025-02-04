#!/usr/bin/env node

"use strict";

var utils = require('utils');
var path = require('path');
var fs = require('fs');

var args = require("minimist")(process.argv.slice(2), {
    boolean: ["help", "in"],
    string: ["file"]
});

var BASE_PATH = path.resolve(
    process.env.BASE_PATH || __dirname
)

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

    var tagetStream = process.stdout; // writable stream
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
    console.log("ex1 usage:");
    console.log("");
    console.log("--help                      print this help");
    console.log("--file={FILENAME}           process the file");
    console.log("--in, -                     process stdin");
    console.log("");
}


