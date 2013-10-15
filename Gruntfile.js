module.exports = function(grunt) {
 
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: ['Gruntfile.js', 'package.json']
      },
      lib: {
        src: ['directives/**/*.js']
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile'],
        options: {
          livereload: true
        }
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('test', [
    'karma'
  ]);

  grunt.registerTask('default', [
    'jshint', 
    'test'
  ]);
 
};