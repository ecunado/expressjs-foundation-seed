module.exports = function (grunt) {

  // Load grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Clean task
    clean: {
      pre: ['dist/*', 'temp/*'],
      post: ['dist/vendor']
    },

    // Copy src contents into dist folder
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'public/',
          dest: 'dist/',
          src: ['*', 'css/**', 'vendor/**', 'js/**', 'images/**'],
          filter: 'isFile'
        }]
      }
    },

    // Compiles sass files
    sass: {
      options: {
        includePaths: ['public/vendor/foundation/scss']
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'public/css/main.css': 'public/scss/main.scss'
        }
      }
    },

    useminPrepare: {
      html: [
        'dist/*.html' // Ficheros donde buscamos bloques de build
      ]
    },

    usemin: {
      html: [
        'dist/*.html'
      ],
      options: {
        dirs: ['dist/']
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 8
      },
      assets: {
        files: [{
          src: [
            'dist/css/*.css',
            'dist/js/*.js'
          ]
        }]
      }
    },

    // Image optimization
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'src/images/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'dist/images/'
        }]
      }
    },

    // listen for changes (development)
    watch: {
      grunt: {
        files: ['Gruntfile.js']
      },

      sass: {
        files: 'src/scss/**/*.scss',
        tasks: ['sass']
      },

      js: {
        files: ['src/js/**'],
        tasks: ['build'],
      },

      livereload: {
        options: {
          livereload: true
        },
        files: [
          'src/*.html',
          'src/css/**',
        ]
      }
    },

    connect: {
      server: {
        options: {
          base: 'src',
          port: 8000
        }
      }
    },

    open: {
      dev: {
        path: 'http://127.0.0.1:8000/',
        app: 'Google Chrome'
      }
    }

  });

  // build tasks
  grunt.registerTask('build', ['sass']);

  // default task (development)
  grunt.registerTask('default', [
    'build',
    'connect:server',
    'open',
    'watch'
  ]);

  // asset pipeline tasks
  grunt.registerTask('optimize', [
    'useminPrepare',
    'concat',
    'imagemin',
    'cssmin',
    'uglify',
    'filerev',
    'usemin'
  ]);

  // Dist
  grunt.registerTask('dist', [
    'sass',
    'clean:pre',
    'copy',
    'optimize',
    'clean:post'
  ]);

};