/*
 * Copyright (c) 2015 3CSI All Rights Reserved
 * 
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF 3CSI
 * The copyright notice above does not evidence any actual or intended
 * publication of such source code.
 */
var dist = require('broccoli-dist-es6-module'),
    mergeTrees = require('broccoli-merge-trees'),
    pickFiles = require('broccoli-static-compiler'),
    concat = require('broccoli-concat'),
    uglify = require('broccoli-uglify-js'),
    fs = require("fs");

var license = fs.readFileSync('./LICENSE', "utf8").split('\n').map(function (l) {
    return '//' + l;
}).join('\n');

// build and only pick the global output
var distFiles = pickFiles(dist('src', {
    main: 'bbcode',
    global: 'bbcode',
    packageName: 'bbcode'
}), {
    srcDir: '/globals',
    files: ['main.js'],
    destDir: '/'
});

var tree = concat(distFiles,
    {
        inputFiles: [
            'main.js'
        ],
        outputFile: '/bbcode.js',
        header: license
    });

var min = concat(uglify(tree, {mangle: true}), {
    inputFiles: [
        'bbcode.js'
    ],
    outputFile: '/bbcode.min.js',
    header: license
});

module.exports = mergeTrees([tree, min]);
