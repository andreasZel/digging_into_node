#!/usr/bin/env node

"use strict";

var util = require("util");
var childProc = require("child_process");
const MAX_CHILDREN = 5;

// ************************************

const HTTP_PORT = 8039;

var delay = util.promisify(setTimeout);


main().catch(console.error);


// ************************************

async function main() {
    console.log(`Load testing http://localhost:${HTTP_PORT}...`);

    while (true) {
        var promises = [];

        process.stdout.write(`Sending ${MAX_CHILDREN} request... `)

        for (let i = 0; i < MAX_CHILDREN; i++) {
            promises.push(childProc.spawn("node", ['ex7-child.js']))
        }

        let results = promises.map(function wait(child) {
            return new Promise(function c(resolve, _) {
                child.on("exit", function (code) {
                    if (code === 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
            })
        })

        results = await Promise.all(results);

        if (results.filter(Boolean).length == MAX_CHILDREN) {
            console.log('Succeeded!')
        } else {
            console.log("Reject in some process")
        }

        await delay(500);
    }

}
