var grunt = require('grunt'),
    ejs = require('ejs'),
    posthtml = require('posthtml');

var marked = require('marked');
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    highlight: function (code, lang) {
        return require('highlight.js').highlight(lang, code).value;
    }
});

function render(tplFile, data) {
    data = data || {};
    data.filename = tplFile;
    return renderString(grunt.file.read(tplFile), data);
}

function renderString(html, data) {
    data = data || {};
    data.data = {}; // stupid but apparently needed by ejs...
    return ejs.render(html, data);
}

grunt.registerTask('build-pages', 'Build website pages', function() {
    // build home page
    var homeTpl = 'src/static/index.ejs';
    grunt.file.write('dist/index.html', render(homeTpl));
    grunt.log.writeln('Created home');

    // build code doc
    var docTpl = 'src/layouts/page.ejs',
        navTpl = 'src/layouts/nav.ejs',
        docFolder = 'node_modules/bosonic/doc',
        docConf = grunt.file.readJSON(docFolder + '/config.json');

    docConf.sections.forEach(function(section) {
        var navHtml = render(navTpl, section);

        section.pages.forEach(function(page) {
            var mdFile = [docFolder, section.path, page.path+'.md'].join('/'),
                htmlFile = ['dist', section.path, page.path+'.html'].join('/');
            
            page.content = marked(grunt.file.read(mdFile));

            grunt.file.write(htmlFile, render(docTpl, { page: page, nav: navHtml }));
            grunt.log.writeln('Created '+htmlFile);
        });
    });

    // build elements doc
    var docTpl = 'src/layouts/element.ejs',
        navTpl = 'src/layouts/elt_nav.ejs',
        docFolder = 'node_modules/bosonic-core-elements/doc',
        demoFolder = 'node_modules/bosonic-core-elements/demo',
        docConf = grunt.file.readJSON(docFolder + '/config.json');

    var navHtml = render(navTpl, docConf);

    docConf.sections.forEach(function(section) {
        section.elements.forEach(function(element) {
            var mdFile = docFolder + '/' + element.tag + '.md',
                demoFile = demoFolder + '/' + element.tag + '.html',
                htmlFile = 'dist/elements/' + element.tag + '.html';

            // extract demos
            var demos = {};
            posthtml()
                .use(function(tree) { 
                    tree.match({ tag: 'div' }, function(node) {
                        if (node.attrs.class === 'element-demo') {
                            demos[node.attrs.id] = require('posthtml-render')(node.content);
                        }
                    });
                }).process(grunt.file.read(demoFile), { sync: true });

            // render Markdown and insert demos
            var htmlContent = marked(grunt.file.read(mdFile));
            element.content = posthtml()
                .use(function(tree) { 
                    tree.match({ tag: 'div' }, function(node) {
                        if (node.attrs.class === 'element-demo') {
                            if (!demos[node.attrs.id]) {
                                grunt.warn("Demo snippet '"+node.attrs.id+"' not found for "+element.tag);
                            } else {
                                node.content = require('posthtml-parser')(demos[node.attrs.id]);
                            }
                        }
                        return node;
                    });
                }).process(htmlContent, { sync: true })
                .html;

            // render final HTML file
            grunt.file.write(htmlFile, render(docTpl, { element: element, nav: navHtml }));
            grunt.log.writeln('Created '+htmlFile);
        });
    });
});