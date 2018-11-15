'use strict';

const fs = require('fs');
const unleash = require('unleash-server');
// const myCustomAdminAuth = require('./auth-hook');

let options = {};

if (process.env.DATABASE_URL_FILE) {
    options.databaseUrl = fs.readFileSync(process.env.DATABASE_URL_FILE);
}

unleash.start(options).then(unleash => {
    console.log(`Unleash started on http://localhost:${unleash.app.get('port')}`);
});;
