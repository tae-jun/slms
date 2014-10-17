/*global module:false*/
module.exports = function(grunt) {

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-execute');

    // Default task.
    grunt.registerTask('default', ['execute']);

    // Project configuration.
    grunt.initConfig({
        execute: {
            target: {
                src: ['app.js']
            }
        },
        // Task configuration.
        jasmine_node: {
            options: {
                forceExit: true,
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'spec'
            },
            all: ['test/']
        },
        jshint: {
            options: {
            curly: true,
            eqeqeq: true,
            immed: true,
            latedef: true,
            newcap: true,
            noarg: true,
            sub: true,
            undef: true,
            unused: true,
            boss: true,
            eqnull: true,
            globals: {
                jQuery: true
            }
            },
            gruntfile: {
            src: 'Gruntfile.js'
            },
            lib_test: {
            src: ['lib/**/*.js', 'test/**/*.js']
            }
        },
        nodeunit: {
            files: ['test/**/*_test.js']
        },
        watch: {
            gruntfile: {
            files: '<%= jshint.gruntfile.src %>',
            tasks: ['jshint:gruntfile']
            },
            lib_test: {
            files: '<%= jshint.lib_test.src %>',
            tasks: ['jshint:lib_test', 'nodeunit']
            }
        }
    });

};
