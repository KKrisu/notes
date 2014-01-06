/* jshint node: true */
var directoriesToClean = [/*'app/vendors/*'*/];

var recessConf = {
    'app/app.css': [
        'app/less/*.less'
    ]
};

// Configuration for JS paths - app, vendor and test exclusions.
var files = require('./project_files.json');


module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({

        // Cleans out static/ of previous asset files - development and production
        clean: {
            options: {force: true},
            src: directoriesToClean
        },

        // Copies already-compiled css files to static/ - development and production
        copy: {
            bootstrap: {
                files: [{
                    dest: 'app/vendors/css/bootstrap.css',
                    src: 'bower_components/bootstrap/dist/css/bootstrap.min.css'
                }, {
                    dest: 'app/vendors/bootstrap-less/',
                    src: 'bower_components/bootstrap/less/*.less',
                    filter: 'isFile',
                    expand: true,
                    flatten: true
                }]
            }
        },

        // Concats the js files into static/ - development
        concat: {
            app: {
                dest: files.app.destination,
                src: files.app.include
            },
            vendors: {
                dest: files.vendors.destination,
                src: files.vendors.include
            },
        },

        recess: {
            // recess:concat just compiles .less files
            concat: {
                options: {
                    compile: true
                },
                files: recessConf
            }
        },

        // Watches the js and less files and concats/compiles them on file save - development
        watch: {
            js_vendors: {
                files: 'app/vendors/vendors.js',
                tasks: ['concat:vendors']
            },
            js_app: {
                files: [
                    'app/js/**/*.js',
                    'app/js/*.js',
                    'app/partials/*'
                ],
                tasks: ['concat:app'] // compliling only app.js to speed up development
            },
            less: {
                files: ['app/less/*.less'],
                tasks: 'recess:concat'
            }
        },

        shell: {
            pytest: {
                command: './bin/test',
                options: {
                    stdout: true,
                    stderr: true,
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('common', ['clean', 'copy']);

    // Only runs development-level asset tasks.
    grunt.registerTask('dev', ['common', 'concat', 'recess:concat', 'watch']);

    // Testing
    // grunt.registerTask('pytest', ['shell:pytest']);
    // grunt.registerTask('jstest', ['karma:normal']);
    // grunt.registerTask('test', ['shell:pytest', 'karma:single']);
};
