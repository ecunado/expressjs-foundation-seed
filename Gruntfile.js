module.exports = function (grunt) {

  var configuration = {
    development: true,
    port: 3500,
    temp: '.temp'
  };

  // Load grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    configuration: configuration,

    watch: {
      partials: {
        files: ['views/partials-src/*.html', '!views/partials/*.html'],
        tasks: ['build'],
      },
      sass: {
        files: ['public/scss/**/*.scss'],
        tasks: ['build'],
      },
      js: {
        files: ['public/js/**'],
        tasks: ['build'],
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          '!public/scss/**',
          '!views/partials-src/**',
          '.rebooted', // nodemon restart
          'public/css/**', // dev mode
          'public/assets/css/*.css', // product. mode
          'public/jss/**',
          'config/**',
          'views/**/*.html',
          'server,js'
        ]
      }
    },

    useminPrepare: {
      html: ['public/*.html'], // Ficheros donde buscamos bloques de build
      options: {
        staging: '<%= configuration.temp %>', // Directorio temporal para la salida de ficheros
        dest: 'public/',
        root: 'public/',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['concat', 'cssmin']
            },
            post: {}
          }
        }
      }
    },

    usemin: {
      html: ['public/*.html'],
      options: {
        assetsDirs: ['public']
      }
    },

    // Configuración para la tarea de ficheros sass
    sass: {
      options: {
        style: 'compressed',
        loadPath: ['public/vendor', 'public/vendor/foundation/scss/']
      },
      dist: {
        files: {
          'public/assets/css/main.css': 'public/scss/main.scss'
        }
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'public/images/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'public/assets/images/'
        }]
      }
    },

    // Renames files for browser caching purposes
    rev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 8
      },
      assets: {
        files: [{
          src: [
            'public/assets/css/**/*.css',
            'public/assets/js/**/*.js'
          ]
        }]
      }
    },

    open: {
      dev: {
        path: 'http://127.0.0.1:<%= configuration.port %>/',
        app: 'Google Chrome'
      }
    },

    copy: {
      prebuild: {
        files: [{
          flatten: true,
          expand: true,
          src: ['views/partials-src/*.html'],
          dest: 'public/',
          filter: 'isFile'
        }]
      },
      postbuild: {
        files: [{
          flatten: true,
          expand: true,
          src: ['public/*.html'],
          dest: 'views/partials/',
          filter: 'isFile'
        }]
      },
      partials: {
        files: [{
          flatten: true,
          expand: true,
          src: ['views/partials-src/*'],
          dest: 'views/partials/',
          filter: 'isFile'
        }]
      }
    },

    clean: {
      prebuild: ['public/assets/*', '.tmp/*', 'views/partials/*.html'],
      postbuild: ['public/*.html']
    },

    nodemon: {
      server: {
        script: 'server.js',
        options: {
          ignoredFiles: ['node_modules/**', 'README.md', 'public/js/**'],
          ext: 'js',
          watch: ['config', 'controllers', 'lib'],
          delay: 1000,
          env: {
            PORT: '<%= configuration.port %>'
          },
          cwd: __dirname,
          callback: function (nodemon) {
            // refreshes browser when server reboots
            nodemon.on('restart', function () {
              // Delay before server listens on port
              setTimeout(function () {
                require('fs').writeFileSync('.rebooted', 'rebooted');
              }, 1000);
            });
          }
        }
      }
    },

    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      server: [
        'nodemon:server',
        'watch'
      ],
    }

  });

  grunt.registerTask('optimize', (function () {
    if (!configuration.development) {
      return [
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'rev',
        'usemin'
      ];
    } else {
      return ['copy:partials'];
    }
  })());

  // Build
  grunt.registerTask('build', [
    'clean:prebuild',
    'copy:prebuild',
    'sass',
    'imagemin',
    'optimize',
    'copy:postbuild',
    'clean:postbuild'
  ]);

  // Tarea por defecto de grunt
  grunt.registerTask('default', ['build', 'concurrent:server']);
  // grunt.registerTask('server', ['nodemon']);

};