// This file is used when you press F5 in VSCode from a source file.
// If the file is in the 'test' folder it will launch Mocha
// otherwise it will run the script directly.
// This allows us to run all files with the same debugging configuration
// For the developper it is less hassle.

const { argv, env } = require('process');
const path = require('path');
const fs = require('fs');

let scriptRelativePath = argv[2] || '';
let scriptExtension = path.extname(scriptRelativePath);
let scriptFullPath = path.resolve(scriptRelativePath);
let isTest = scriptRelativePath.startsWith('test\\');
let isDebugMode = typeof v8debug === 'object';
let currentAction = isDebugMode ? 'Debugging' : 'Starting';

if (scriptRelativePath.length == 0) {
    return console.error('Internal Error: debug-current-file.js requires a file to run as an argument.')
}
if (scriptFullPath == __filename) {
    return console.error('There is no point debugging debug-current-file.js.\nYou can however debug any other source or test.\nIn Visual Studio Code press F5 while editing them.')
}

if (scriptExtension == '.ts') require('ts-node').register({});

if (isTest) {
    console.warn(`${currentAction} ${scriptRelativePath} with Mocha...`);
    var Mocha = require('mocha');
    var mocha = new Mocha({ ui: 'bdd', reporter: 'list', timeout: 3600000, useColors: true });
    mocha.addFile(scriptFullPath);
    mocha.run(function (failures) {
        process.exitCode = failures ? 1 : 0;  // exit with non-zero status if there were failures
    });
} else {
    console.warn(`${currentAction} ${scriptRelativePath}...`);
    try {
        var started = new Date();
        var loadedScript = require(scriptFullPath);
        var elapsed = new Date() - started;
        console.warn(`Complete in ${elapsed}ms`);
    } catch (e) {
        console.error(e.message, e);
    }
}
