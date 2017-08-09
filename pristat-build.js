#!/usr/bin/env node

const Prismic = require('prismic-nodejs');
const PrismicDOM = require("prismic-dom");
const rimraf = require('rimraf');
const fs = require('fs');
const pug = require('pug');
const mkdirp = require('mkdirp');
const utils = require('./utils');
const chalk = require('chalk');

(async function () {
    let config = await utils.loadConfig();

    function checkURL(url) {
        let longEnough = url.length > 0;
        let endsInSlash = url.slice(-1) === '/';
        return longEnough && endsInSlash;
    }

    function checkPageContent(pageContent) {
        let goodURL = !!pageContent.url && checkURL(pageContent.url);
        let goodTitle = !!pageContent.page_title && (pageContent.page_title.length > 0);

        return goodURL && goodTitle;
    }

    function getPageContent(page) {
        return page.rawJSON;
    }



    function getLayoutPath(layoutName) {
        return process.cwd() + '/_layout/' + layoutName + '.pug';
    }

    function layoutExists(layoutName) {
        return utils.fileExists(getLayoutPath(layoutName));
    }

    function convertPrismicToObject(content) {
        let obj = {};
        if(content.constructor === Array){
            obj = [];
        }
        Object.keys(content).map(function (key) {
            let field = content[key];
            if(!!field && field.constructor === Array){
                try {
                    field = PrismicDOM.RichText.asHtml(field);
                } catch (e){
                    field = convertPrismicToObject(field);
                }
            }
            else if(!!field && field.constructor === Object){
                field = convertPrismicToObject(field);
            }
            obj[key] = field;
        });
        return obj;
    }

    function getFileFolder(url){
        return process.cwd() + "/" + config.buildPath + url;
    }

    function getFilePath(url){
        return getFileFolder(url) + "index.html"
    }

    function renderPage(page) {
        let content = getPageContent(page);
        console.info(chalk.yellow(`Rendering: ${content.url}`));
        if (!!content.layout) {
            layoutExists(content.layout).then(function (layoutPath) {
                let pugVars = convertPrismicToObject(content);
                let rendered = pug.renderFile(layoutPath, pugVars);
                let fileFolder = getFileFolder(pugVars.url);
                let filePath = getFilePath(pugVars.url);
                mkdirp(fileFolder, function (err) {
                    if(err){
                        console.log(err);
                    }
                    else {
                        fs.writeFile(filePath, rendered, function(err){
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                });
            }, function () {
                console.log(chalk.red(`Unable to render ${content.url}: \n\tLayout "${content.layout}" does not exist.`))
            });
        }
    }

    function renderPages(pages) {
        for (let i = 0; i < pages.length; i++) {
            let page = pages[i];
            let pageContent = page.rawJSON;
            if (checkPageContent(pageContent)) {
                renderPage(page);
            }
        }
    }

    function getPages() {
        return new Promise(function (resolve, reject) {
            let apiReady = Prismic.getApi(config.apiURL);
            apiReady.then(function (api) {
                api.query('').then(function (content) {
                    resolve(content.results);
                }, function(){console.log("QUERY FAILED")});
            }, function(){console.log("API NOT READY")});
        });
    }

    function build() {
        rimraf(config.buildPath, function () {
            getPages().then(renderPages, function () {
            });
        });
    }

    build();
})();