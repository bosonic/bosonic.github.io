module.exports = function (grunt) {

  grunt.initConfig({
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
          sortFunction: function (a, b) {
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
      dist: 'dist'
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

  grunt.registerTask('readme', 'Download README.md from bosonic web components', function() {
    grunt.log.writeln("### Downloading README.md ###");
    var readmetest = grunt.file.readJSON('repos/bosonic_opt.json');
    var readmes = [];
    readmetest.repos.forEach(function (repodesc) {
      readmes.push(repodesc.url + '/raw/' + repodesc.master_branch + '/README.md');
    });
    console.log(readmes);
  });

  grunt.registerTask('dlmd', ['repos', 'readme']);

  require('load-grunt-tasks')(grunt);
};
