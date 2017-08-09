#!/usr/bin/env node

const program = require("commander");

program
    .version("0.0.1")
    .command("init", "Initialize a pristat project.")
    .command("build", "Build your pristat project.")
    .parse(process.argv);