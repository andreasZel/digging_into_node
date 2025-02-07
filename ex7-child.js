"use strict";


// ************************************

const HTTP_PORT = 8039;


main().catch(() => 1);


// ************************************

async function main() {
    try {
        let res = await fetch("http://localhost:8039/get-records");

        if (res && res.ok) {
            let records = await res.json();
            if (records) {
                process.exitCode = 0;
                return;
            }
        }
    } catch (e) {
    }
    process.exitCode = 1;
}
