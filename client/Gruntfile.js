/* jshint node: true */
'use strict';

var directoriesToClean = [/*'app/vendors/*'*/];

var recessConf = {
    'app/static/app.css': [
        'less/*.less'
    ]
};

// Configuration for JS paths - app, vendor and test exclusions.
var files = require('./project_files.json');


module.exports = function(grunt) {

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
                    dest: 'app/static/vendors/css/bootstrap.css',
                    src: 'bower_components/bootstrap/dist/css/bootstrap.min.css'
                }, {
                    dest: 'app/static/vendors/bootstrap-less/',
                    src: 'bower_components/bootstrap/less/*.less',
                    filter: 'isFile',
                    expand: true,
                    flatten: true
                }, {
                    dest: 'app/static/vendors/fonts/',
                    src: 'bower_components/bootstrap/dist/fonts/*',
                    filter: 'isFile',
                    expand: true,
                    flatten: true
                }]
            },
            angularMaterial: {
                files: [{
                    dest: 'app/static/vendors/css/angular-material.css',
                    src: 'bower_components/angular-material/angular-material.css'
                }]
            },
            angularMaterialIcons: {
                files: [{
                    dest: 'app/static/vendors/css/angular-material-icons.css',
                    src: 'bower_components/angular-material-icons/angular-material-icons.css'
                }]
            },
            ngProgress: {
                files: [{
                    dest: 'app/static/vendors/css/ngProgress.css',
                    src: 'bower_components/ngprogress/ngProgress.css'
                }]
            },
            angularGrowl: {
                files: [{
                    dest: 'app/static/vendors/css/angular-growl.min.css',
                    src: 'bower_components/angular-growl/build/angular-growl.min.css'
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
                files: 'static/vendors/vendors.js',
                tasks: ['concat:vendors']
            },
            js_app: {
                files: [
                    'js/**/*.js',
                    'js/*.js',
                    'partials/*'
                ],
                tasks: ['concat:app'] // compliling only app.js to speed up development
            },
            less: {
                files: ['less/*.less'],
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

    grunt.registerTask('dev', ['common', 'concat', 'recess:concat', 'watch']);
};
