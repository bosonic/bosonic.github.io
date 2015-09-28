bosonic.github.io
=================

Bosonic website is built with [CabinJS](http://www.cabinjs.com), a static site generator powered by Grunt.

Therefore to contribute, you need to do a pull request on the `dev` branch.

[Visit the website](http://bosonic.github.io/)

### Getting started

Fork the GitHub project first.

Install **node.js**, then install npm dependencies:

    $ npm install

In order to include elements' doc & demos, you'll need to npm link their working trees:

    $ cd core-elements
    $ npm link
    $ cd bosonic.github.io
    $ npm link bosonic-core-elements
    
Do the same with dnd-elements & data-elements.

You are now ready to go:

    $ grunt server

The website is available at **http://127.0.0.1:5455**.
