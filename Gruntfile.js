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
          'src/pages/**/*.ejs'
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
      dist: ['dist'],
      components: ['posts/pages/components/*']
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
          'components_repositories.json': ['repos?page=1&per_page=100']
        }
      }
    },
    'curl-dir': {
      readmes: {
        src: [],
        router: function (url) {
          return url.replace(/^https:\/\/github.com\/bosonic\/([A-Za-z0-9\-]*)\/raw\/master\/README.md/, '$1.md');
        },
        dest: 'posts/pages/components'
      }
    },
    file_append: {
      readmes: {
        files: []
      }
    }
  });
  
  grunt.registerTask('set_curl_config', function() {
    var config = grunt.config.get('curl-dir');

    var readmes = [],
        reposjson = grunt.file.readJSON('components_repositories.json'),
        whitelist = grunt.file.readJSON('components_whitelist.json');
    
    reposjson.repos.forEach(function(repodesc) {
      if (whitelist.indexOf(repodesc.name) !== -1) {
        var url = repodesc.url + '/raw/master/README.md';
        readmes.push(url);
      }
    });

    config.readmes.src = readmes;
    grunt.config.set('curl-dir', config);
  });

  grunt.registerTask('set_append_config', function() {
    var config = grunt.config.get('file_append');

    var files = {};
    grunt.file.recurse('posts/pages/components', function (abspath, rootdir, subdir, filename) {
      files[abspath] = {
        prepend: '{\n\ttitle: "'+filename.replace('.md', '')+'", \n\ttype: "static", \n\tsection: "components"\n}\n\n',
        input: abspath
      };
    });

    config.readmes.files = files;
    grunt.config.set('file_append', config);
  });
  
  grunt.registerTask('readmes', [
    'clean:components',
    'repos',
    'set_curl_config',
    'curl-dir',
    'set_append_config',
    'file_append'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
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