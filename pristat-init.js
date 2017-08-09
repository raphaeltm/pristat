#!/usr/bin/env node

const co = require('co');
const prompt = require('co-prompt');
const rimraf = require('rimraf');
const fs = require('fs');
const chalk = require("chalk");
const mkdirp = require("mkdirp");
const utils = require("./utils");

co( function *() {
    let pristatConfig = {};
    pristatConfig.apiURL = yield prompt('Prismic API (V2) URL: ');
    pristatConfig.buildPath = yield prompt("Build path: ");
    rimraf(process.cwd() + "pristat.json", function () {
        fs.writeFile("pristat.json", JSON.stringify(pristatConfig), async function(err){
            if(err){
                console.error(chalk.red("Unable to initialize."));
            }
            else {
                await utils.mkdir("_assets");
                await utils.mkdir("_partials");
                await utils.mkdir("_layouts");
                console.info(chalk.green("Initialized."));
                process.exit();
            }
        })
    });
});