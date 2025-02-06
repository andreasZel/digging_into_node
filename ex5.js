#!/usr/bin/env node

"use strict";

var util = require("util");
var path = require("path");
var http = require("http");

var sqlite3 = require("sqlite3");
var staticAlias = require("node-static-alias");


// ************************************

const DB_PATH = path.join(__dirname, "my.db");
const WEB_PATH = path.join(__dirname, "web");
console.log(`Resolved WEB_PATH: ${WEB_PATH}`);
const HTTP_PORT = 8039;

var delay = util.promisify(setTimeout);

// define some SQLite3 database helpers
//   (comment out if sqlite3 not working for you)
var myDB = new sqlite3.Database(DB_PATH);
var SQL3 = {
    run(...args) {
        return new Promise(function c(resolve, reject) {
            myDB.run(...args, function onResult(err) {
                if (err) reject(err);
                else resolve(this);
            });
        });
    },
    get: util.promisify(myDB.get.bind(myDB)),
    all: util.promisify(myDB.all.bind(myDB)),
    exec: util.promisify(myDB.exec.bind(myDB)),
};

var fileServer = new staticAlias.Server(WEB_PATH, {
    cache: 100,
    serverInfo: "Node Workshop: ex5",
    alias: [
        {
            match: /^\/(?:index\/?)?(?:[?#].*$)?$/,
            serve: "index.html",
            force: true,
        },
    ],
});

var httpserv = http.createServer(handleRequest);

main();


// ************************************

function main() {
    httpserv.listen(HTTP_PORT);
    console.log(`Listening on http://localhost:${HTTP_PORT}...`);
}

async function handleRequest(req, res) {
    try {
        fileServer.serve(req, res, (err) => {
            if (err) {
                console.error("Error serving file:", err);
                res.writeHead(err.status, { "Content-Type": "text/plain" });
                res.end(`Error: ${err.message}`);
            }
        });
    } catch (err) {
        console.error("Unhandled error:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
    }
}

// *************************
// NOTE: if sqlite3 is not working for you,
//   comment this version out
// *************************
async function getAllRecords() {
    var result = await SQL3.all(
        `
		SELECT
			Something.data AS "something",
			Other.data AS "other"
		FROM
			Something
			JOIN Other ON (Something.otherID = Other.id)
		ORDER BY
			Other.id DESC, Something.data
		`
    );

    return result;
}

// *************************
// NOTE: uncomment and use this version if
//   sqlite3 is not working for you
// *************************
// async function getAllRecords() {
// 	// fake DB results returned
// 	return [
// 		{ something: 53988400, other: "hello" },
// 		{ something: 342383991, other: "hello" },
// 		{ something: 7367746, other: "world" },
// 	];
// }
