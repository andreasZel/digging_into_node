#!/usr/bin/env node

"use strict";

var path = require('path');
var fs = require('fs');
var args = require("minimist")(process.argv.slice(2), {
    boolean: [help],
    string: [file]
});

if (args.help) {

    printHelp();
} else if (args.file) {
    let filepath = path.resolve(args.file);
    processFile(filepath);
} else {

    error('Incorrect usage.', true);
}

// ************************

function processFile(filepath) {
    var contents = fs.readFileSync(filepath);
    process.stdout.write(contents);
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
}


