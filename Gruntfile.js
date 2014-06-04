'use strict';
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bumpup');
  grunt.loadNpmTasks('grunt-tagrelease');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    base: 'lib',
    dist: 'build',
    tmp: '.tmp',
    filename: 'canon-angular',

    connect: {
      server: {
        options: {
          port: 9000,
          base: 'examples',
          middleware: function (connect, options) {
            var livereload = require('connect-livereload');
            return [
              livereload(),
              connect.static('bower_components'),
              connect.static('build'),
              // Serve static files.
              connect.static(options.base),
              // Make empty directories browsable.
              connect.directory(options.base)
            ];
          }
        }
      }
    },

    open: {
      server: {
        url: 'http://localhost:<%= connect.server.options.port %>'
      }
    },

    clean: {
      all: ['build'],
      views: {
        files: [{
          dot: true,
          src: [
            '<%= base %>/scripts/views.js'
          ]
        }]
      }
    },

    jshint: {
      files: [
        'Gruntfile.js',
        '<%= base %>/scripts/**/*.js',
        '!<%= base %>/scripts/views.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },


    html2js: {
      options: {
        base: './lib',
        module: 'ui.canon.templates',
        rename: function(moduleName) {
          return '/' + moduleName;
        },
        htmlmin: {
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        }
      },
      main: {
        src: ['<%= base %>/views/**/*.html'],
        dest: '<%= base %>/scripts/views.js'
      }
    },

    ngmin: {
      dist: {
        expand: true,
        cwd: 'lib/scripts/',
        src: ['**/*.js'],
        dest: '<%= tmp %>/scripts'
      }
    },

    concat: {
      dist: {
        src: ['<%= tmp %>/scripts/**/*.js'],
        dest: '<%= dist %>/<%= filename %>.js'
      },
      release: {
        src: ['build/scripts/**/*.js'],
        dest: '<%= dist %>/<%= filename %>-<%= pkg.version %>.js'
      }
    },

    uglify: {
      dist: {
        src: '<%= dist %>/<%= filename %>.js',
        dest:'<%= dist %>/<%= filename %>.min.js'
      },
      release:{
        src: '<%= dist %>/<%= filename %>-<%= pkg.version %>.js',
        dest:'<%= dist %>/<%= filename %>-<%= pkg.version %>.min.js'
      }
    },

    copy: {
      dev: {
        cwd: 'lib/views/',
        expand: true,
        src: ['**/*.html'],
        dest: '<%= dist %>/views'
      }
    },

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      unit: {
        singleRun: true
      },
      dev: {
        browsers: ['Chrome'],
        singleRun: false,
        autoWatch: true
      },
      travis: {
        singleRun: true,
        browsers: ['Firefox']
      }
    },

    bumpup: 'package.json',

    /*
      Commit the changes and tag the last commit with
      a version from provided JSON file.
      If there is nothing to commit, the task will tag the current last commit.
     */
    tagrelease: 'package.json',

    watch: {
      html: {
        files: ['examples/**/*.html', 'lib/views/**/*.html'],
        options: {
          livereload: true
        },
        tasks: ['cache-views', 'copy:dev']
      },
      lib: {
        files: '<%= jshint.files %>',
        tasks: ['jshint', 'build', 'copy:dev'],
        options: {
          livereload: true
        }
      },
      views: {
        files: ['<%= base %>/views/{,*/}*.html'],
        options: {
          livereload: true
        },
        tasks: ['cache-views', 'copy:dev']
      }
    }
  });

  grunt.registerTask('test', 'Run tests on singleRun karma server', function() {
    if (process.env.TRAVIS) {
      grunt.task.run('karma:travis');
    } else {
      grunt.task.run('karma:unit');
    }
  });
  grunt.registerTask('testwatch', [
    'karma:dev'
  ]);

  grunt.registerTask('cache-views', [
    'clean:views',
    'html2js:main'
  ]);
  grunt.registerTask('build', [
    'clean',
    'cache-views',
    'ngmin:dist',
    'concat:dist',
    'uglify:dist'
  ]);
  grunt.registerTask('default', [
    'jshint',
    'build',
    'test'
  ]);
  grunt.registerTask('server', [
    'jshint',
    'build',
    'copy:dev',
    'connect:server',
    'open',
    'watch'
  ]);
  grunt.registerTask('release', function(type) {
    type = type ? type : 'patch';
    grunt.task.run('jshint');
    grunt.task.run('build');
    grunt.task.run('test');
    grunt.task.run('bumpup:' + type);
  });
};