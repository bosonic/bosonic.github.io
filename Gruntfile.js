module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pages: {
      posts: {
        src: 'posts',
        dest: 'dist',
        layout: 'src/layouts/post.ejs',
        url: 'posts/:title/',
        options: {
          pageSrc: 'src/pages',
          data: {
            baseUrl: '/'
          },
          pagination: {
            postsPerPage: 10,
            listPage: 'src/pages/index.ejs'
          },
          sortFunction: function(a, b) {
            return a.order - b.order;
          },
        }
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'src/styles',
          cssDir: 'dist/styles'
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src',
          dest: 'dist',
          src: [
            'images/**',
            'scripts/**',
            'styles/**.css',
            'styles/fonts/**',
          ]
        }]
      }
    },
    watch: {
      pages: {
        files: [
          'posts/**',
          'src/layouts/**',
          'src/pages/**/*.md'
        ],
        tasks: ['pages']
      },
      compass: {
        files: ['src/styles/**'],
        tasks: ['compass']
      },
      copy: {
        files: [
          'src/images/**',
          'src/scripts/**',
          'src/styles/**.css',
          'src/styles/fonts/**'
        ],
        tasks: ['copy']
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
          hostname: '0.0.0.0',
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
      dist: ['dist', 'repos']
    },
    'gh-pages': {
      options: {
        base: 'dist',
        branch: 'master',
      },
      src: ['**']
    },
    repos: {
      multiple_opts: {
        options: {
          username: 'bosonic',
          filterBy: 'name',
          include: 'b-',
          sortBy: 'name'
        },
        files: {
          'repos/bosonic_opt.json': ['repos?page=1&per_page=100']
        }
      }
    },
    curl: {
      readmes: {
        src: function() {
          if (grunt.file.exists('repos/bosonic_opt.json')) {
            var reposjson = grunt.file.readJSON('repos/bosonic_opt.json');
            var readmes = [];
            reposjson.repos.forEach(function(repodesc) {
              var url = repodesc.url + '/raw/' + repodesc.master_branch + '/README.md';
              readmes.push(url);
            });
          } else {

          }
          return readmes;
        }(),
        dest: 'posts/pages/components/components_readmes.md'
      }
    },
    file_append: {
      default_options: {
        files: {
          'posts/pages/components/components_readmes.md': {
            prepend: '{\n\ttitle: "Components", \n\ttype: "static", \n\tsection: "components"\n}\n\n',
            input: 'posts/pages/components/components_readmes.md'
          }
        }
      }
    }
  });

  grunt.registerTask('readmes:github', 'Download Bosonic Components readme.md', 'repos');
  grunt.registerTask('readmes:download', 'Download github info', 'curl:readmes');
  grunt.registerTask('readmes:create', 'Concatenate the components readme.md', 'file_append');

  grunt.registerTask('readmes', '', function() {
    if (grunt.file.exists('repos/bosonic_opt.json')) {
      grunt.task.run('readmes:download');
      grunt.task.run('readmes:create');
      grunt.log.ok('all components readmes are appended in \'' + 'posts/pages/components/components_readmes.md' + '\'');
    } else {
      grunt.fail.fatal(grunt.util.error('repos/bosonic_opt.json does not exist, run \'readmes:github\' first'));
      grunt.log.error('You need to run \'readmes:github\' first, then you can run \'readmes\'');
    }
  });

  grunt.registerTask('build', [
    'clean',
    'pages',
    'compass',
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