/*global module:false*/
module.exports = function (grunt) {

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-ts');

    // Default task.
    grunt.registerTask('default', ['clean', 'ts', 'concat', 'copy']);

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
                src: ['vendor/jquery/*.js', 'vendor/spectrum/*.js', 'vendor/jquery-ui/*.js'],
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
                files: [
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
                tasks: ['clean', 'concat', 'copy']
            }
        },
        ts: {
            // A specific target
            build: {
                // The source TypeScript files, http://gruntjs.com/configuring-tasks#files
                src: ["./src/**/*.ts"],
                // The source html files, https://github.com/grunt-ts/grunt-ts#html-2-typescript-support
                //html: ["test/work/**/*.tpl.html"],
                // If specified, generate this file that to can use for reference management
                //reference: "./test/reference.ts",
                // If specified, generate an out.js file which is the merged js file
                out: 'tsout/out.js',
                // If specified, the generate JavaScript files are placed here. Only works if out is not specified
                //outDir: 'test/outputdirectory',
                // If specified, watches this directory for changes, and re-runs the current target
                //watch: 'test',
                // Use to override the default options, http://gruntjs.com/configuring-tasks#options
                options: {
                    // 'es3' (default) | 'es5'
                    target: 'es5',
                    // 'amd' (default) | 'commonjs'
                    //module: 'commonjs',
                    // true (default) | false
                    sourceMap: false,
                    // true | false (default)
                    declaration: false,
                    // true (default) | false
                    removeComments: true
                },
            }
        },
    });
};
