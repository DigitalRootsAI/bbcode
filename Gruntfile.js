'use strict';
var serveStatic = require('serve-static');

var mountFolder = function (dir) {
    return serveStatic(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        broccoli_build: {
            assets: {
                dest: 'dist/',
                brocfile: 'Brocfile.js' // default
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        'tmp',
                        'dist'
                    ]
                }]
            }
        },
        connect: {
            options: {
                port: 9001,
                hostname: 'localhost'
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder('.')
                        ];
                    }
                }
            },
            testServe: {
                options: {
                    keepalive: true,
                    middleware: function (connect) {
                        return [
                            mountFolder('.')
                        ];
                    }
                }
            }
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%= connect.options.port %>/test/index.html']
                }
            }
        }
    });

    grunt.registerTask('test', [
        'clean:dist',
        'broccoli_build',
        'connect:test',
        'mocha'
    ]);

    grunt.registerTask('test-server', [
        'clean:dist',
        'broccoli_build',
        'connect:testServe'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'broccoli_build'
    ]);

    grunt.registerTask('default', [
        'test'
    ]);
};
