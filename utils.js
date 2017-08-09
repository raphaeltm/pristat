const Prismic = require('prismic-nodejs');
const PrismicDOM = require("prismic-dom");
const rimraf = require('rimraf');
const fs = require('fs');
const pug = require('pug');
const mkdirp = require('mkdirp');
const ncp = require("ncp").ncp;

let utils = {};

utils.fileExists = function(path) {
    return new Promise(function (resolve, reject) {
        fs.stat(path, function (err, stat) {
            if (err === null) {
                resolve(path);
            } else if (err.code === 'ENOENT') {
                reject(path);
            } else {
                reject(path);
            }
        });
    });
};

utils.pristatInitialized = function () {
    return utils.fileExists(process.cwd() + "/pristat.json");
};

utils.loadConfig = function () {
    return new Promise(function (resolve, reject) {
        utils.pristatInitialized().then(function(path){
            try {
                resolve(require(path))
            }
            catch (e){
                reject(path);
            }
        }, function(path){
            reject(path);
        })
    });
};

utils.mkdir = function (path, opts) {
    return new Promise((resolve, reject) => {
        mkdirp(path, opts, function(err){
            if(err){
                reject();
            }
            else {
                resolve(path);
            }
        })
    });
};

utils.ncp = function (source, dest) {
    return new Promise((resolve, reject) => {
        ncp(source, dest, (err) => {
            if(err){
                reject();
            }
            else {
                resolve();
            }
        });
    });
};

module.exports = utils;