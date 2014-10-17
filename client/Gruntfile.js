/*global module:false*/
module.exports = function(grunt) {

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task.
    grunt.registerTask('default', ['clean', 'concat', 'copy']);

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        distdir: 'dist',
        pkg: grunt.file.readJSON('package.json'),
        src: {
            html: ['src/**/*.html'],
            css: ['src/**/*.css'],
            tsout: ['tsout/*.js'],
            tsoutmap: ['tsout/*.js.map'],
            index: ['src/index.html']
        },
        clean: ['<%= distdir %>/**/*'],
        // Task configuration.
        concat: {
            angular: {
                // because of dependency, we must order
                src: ['vendor/angular/angular.js', 'vendor/angular/angular-resource.js', 'vendor/angular-ui/angular-ui.js'],
                dest: '<%= distdir %>/angular.js'
            },
            jquery: {
                src: ['vendor/jquery/*.js', 'vendor/spectrum/*.js'],
                dest: '<%= distdir %>/jquery.js'
            },
            css: {
                src: ['<%= src.css %>', 'vendor/**/*.css'],
                dest: '<%= distdir %>/<%= pkg.name %>.css'
            },
            d3: {
                src: ['vendor/d3/d3.js'],
                dest: '<%= distdir %>/d3.js'
            },
            // because of process option, must concat. Do not just copy
            index: {
                src: ['<%= src.index %>'],
                dest: '<%= distdir %>/index.html',
                options: {
                    process: true
                }
            }
        },
        copy: {
            tpl: {
                files:[
                    {
                        expand: true,
                        cwd: 'src',
                        src: '**/*.tpl.html',
                        dest: '<%= distdir %>',
                        flatten: true,
                        filter: 'isFile'
                    }
                ]
            },
            tsout: {
                src: '<%= src.tsout %>',
                dest: '<%= distdir %>/<%= pkg.name %>.js'
            }
        },
        watch: {
            autoBuild: {
                files: ['<%= src.tsout %>', 'src/**/*.css', 'src/**/*.html'],
                tasks: ['default']
            }
        }
    });
};
