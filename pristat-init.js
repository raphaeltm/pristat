#!/usr/bin/env node

const co = require('co');
const prompt = require('co-prompt');
const rimraf = require('rimraf');
const fs = require('fs');

co( function *() {
    let pristatConfig = {};
    pristatConfig.apiURL = yield prompt('Prismic API (V2) URL: ');
    pristatConfig.buildPath = yield prompt("Build path: ");
    rimraf(process.cwd() + "pristat.json", function () {
        fs.writeFile("pristat.json", JSON.stringify(pristatConfig), function(err){
            if(err){
                console.error("Unable to initialize.");
            }
            else {
                console.info("Initialized.");
            }
            process.exit();
        })
    });
});