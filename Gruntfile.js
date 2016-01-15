require('./tasks/build-pages');

module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    sass: {
      options: {
        includePaths: ['node_modules/compass-mixins/lib']
      },
      dist: {
        files: {
          'dist/styles/main.css' : 'src/styles/main.scss'
        }
      }
    },

    copy: {
      assets: { expand: true, cwd: 'src', dest: 'dist', src: ['images/**', 'scripts/**', 'styles/**.css', 'styles/fonts/**']},
      bosonic: { expand: true, cwd: 'node_modules/bosonic/dist', dest: 'dist/bosonic', src: '**/*' }
    },

    watch: {
      pages: {
        files: ['src/static/*.ejs', 'src/layouts/*.ejs', 'src/partials/*.ejs'],
        tasks: ['build-pages']
      },
      sass: {
        files: ['src/styles/**/*'],
        tasks: ['sass']
      },
      assets: {
        files: ['src/images/**', 'src/scripts/**', 'src/styles/**.css', 'src/styles/fonts/**'],
        tasks: ['copy:assets']
      },
      dist: {
        files: ['dist/**'],
        options: {
          livereload: true
        }
      }
    },

    connect: {
      dist: {
        options: {
          port: 5455,
          hostname: '*',
          base: 'dist',
          livereload: true
        }
      }
    },

    open: {
      dist: {
        path: 'http://localhost:5455'
      }
    },

    clean: {
      dist: ['dist']
    },

    'gh-pages': {
      options: {
        base: 'dist',
        branch: 'master',
      },
      src: ['**']
    }
  });

  grunt.registerTask('build', [
    'clean',
    'build-pages',
    'sass',
    'copy'
  ]);

  grunt.registerTask('deploy', ['build', 'gh-pages']);

  grunt.registerTask('server', [
    'build',
    'connect',
    'open',
    'watch'
  ]);

  grunt.registerTask('default', 'server');

  require('load-grunt-tasks')(grunt);
};