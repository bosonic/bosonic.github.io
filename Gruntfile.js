module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    
    pages: {
      options: {
        data: {
          baseUrl: '/'
        },
        sortFunction: function(a, b) {
          return a.order - b.order;
        },
      },
      pages: {
        options: { pageSrc: 'src/static' },
        src: 'src/pages',
        dest: 'dist',
        layout: 'src/layouts/page.ejs',
        url: ':title'
      },
      docs: {
        src: 'src/doc',
        dest: 'dist',
        layout: 'src/layouts/page_with_nav.ejs',
        url: ':category/:section/:title'
      },
      elements: {
        src: 'src/elements',
        dest: 'dist',
        layout: 'src/layouts/element.ejs',
        url: 'elements/:title'
      }
    },

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
      core_demos: { expand: true, cwd: 'node_modules/bosonic-core-elements/demo', dest: 'dist/demos', src: '**/*' },
      core_docs: { expand: true, cwd: 'node_modules/bosonic-core-elements/doc', dest: 'src/elements', src: '**/*' },
    },

    watch: {
      pages: {
        files: ['src/static/*.ejs', 'src/layouts/*.ejs', 'src/partials/*.ejs', 'src/**/*.md'],
        tasks: ['pages']
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

  grunt.registerTask('elements', [
    'copy:core_demos',
    'copy:core_docs'
  ]);

  grunt.registerTask('build', [
    'clean',
    'elements',
    'pages',
    'sass',
    'copy:assets'
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