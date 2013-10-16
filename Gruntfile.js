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

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dist: 'dist',
    filename: 'canon-angular',
    jshint: {
      files: [
        'Gruntfile.js',
        'directives/**/*.js',
        'test/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    clean: {
      all: ['dist']
    },
    concat: {
      dist: {
        // options: {
        //   banner: '<%= meta.modules %>\n'
        // },
        cwd: "dist/",
        src: ['directives/**/*.js', '!directives/**/*.spec.js'],
        dest: '<%= dist %>/<%= filename %>-<%= pkg.version %>.js'
      }
    },
    connect: {
      server: {
        options: {
          port: 9000,
          middleware: function (connect) {
            var livereload = require('connect-livereload');

            return [
              livereload(),
              connect.static('examples'),
              connect.static('dist'),
              connect.directory('examples')
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
    ngmin: {
      directives: {
        expand: true,
        cwd: 'directives/',
        src: ['**/*.js', '!**/*.spec.js'],
        dest: 'dist/directives'
      }
    },
    uglify: {
      dist:{
        src: '<%= dist %>/<%= filename %>-<%= pkg.version %>.js',
        dest:'<%= dist %>/<%= filename %>-<%= pkg.version %>.min.js'
      }
    },
    watch: {
      jshint: {
        files: ['jshint:files'],
        tasks: ['jshint']
      },
      html: {
        files: ['examples/**/*.html', 'templates/**/*.html'],
        options: {
          livereload: true
        }
      },
      lib: {
        files: '<%= jshint.files %>',
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('build', ['clean', 'ngmin:directives', 'concat', 'uglify']);
  grunt.registerTask('default', ['jshint', 'build']);
  grunt.registerTask('server', ['jshint', 'build', 'connect:server', 'open', 'watch']);
};