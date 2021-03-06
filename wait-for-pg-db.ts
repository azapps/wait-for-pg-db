#!/usr/bin/env node
import fs from 'fs';
const debug = require('debug')('showcase:ensure-kafka-topics:debug');
const { Client } = require('pg')

const abort_after_tries = process.env.ABORT_AFTER_TRIES || 10;
const wait_between_tries_s = process.env.WAIT_BETWEEN_TRIES_S || 5;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function try_to_connect(abort_after_tries, wait_between_tries_s) {
    var tries_left = abort_after_tries;
    while(tries_left > 0) {
        try {
            const client = new Client()
            await client.connect();
            return client;
        } catch(e) {
            debug("Could still not connect to the db",e.message);
        }
        tries_left--;
        await sleep(wait_between_tries_s * 1000);
    }
    throw new Error("Failed to connect to db");
}

try_to_connect(abort_after_tries, wait_between_tries_s).then(async (client) => {
    const run_sql_after_connect_raw = process.env.RUN_SQL_AFTER_CONNECT;
    if(run_sql_after_connect_raw) {
        const run_sql_after_connect = run_sql_after_connect_raw.split(",").map(x => x.trim());
        for(const i in run_sql_after_connect) {
            const file = run_sql_after_connect[i];
            var sql = fs.readFileSync(file, 'utf8');
            try {
                await client.query(sql);
                debug("Executed SQL script from", file);
            } catch(e) {
                console.error("Failed to execute query", e.message);
                process.exit(1);
            }
        }
    }
    client.end();
    process.exit(0);
}).catch(e => {
    console.log("Error:", e);
    process.exit(1);
});
