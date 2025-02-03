#!/usr/bin/env node

"use strict";

var args = require("minimist")(process.argv.slice(2), {
    boolean: [help],
    string: [file]
});

if (args.help) {

    printHelp();
} else if (args.file) {

    console.log(args.file);
} else {

    error('Incorrect usage.', true);
}

// ************************

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
}


