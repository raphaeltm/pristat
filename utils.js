const Prismic = require('prismic-nodejs');
const PrismicDOM = require("prismic-dom");
const rimraf = require('rimraf');
const fs = require('fs');
const pug = require('pug');
const mkdirp = require('mkdirp');

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

module.exports = utils;