{
  title: "Getting the code",
  category: "documentation",
  section: "Getting started",
  order: 1
}

# Getting the code

The preferred way to install Bosonic is through npm, but you can download the Bosonic platform as a ZIP file. It contains two files: `webcomponents.js`, which is the community polyfills, and `bosonic-runtime.js`, which is the Bosonic library (not the elements!).

## With npm

We'll assume you've already installed Node.js and npm ([platform specific installation instructions](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)).

If you've just setup your project and haven't a `package.json` file, it's time to generate one:

``` bash
npm init
```

You can now install the Bosonic package:

``` bash
npm install --save-dev bosonic
```

And don't forget to install the `webcomponents.js` polyfills ; they're bundled with the Bosonic package as a dependency, but as you may know, npm installs dependencies in a nested hierarchy, which is not always practical.

``` bash
npm install --save-dev webcomponents.js
```

## Installing elements

Bosonic's elements are grouped in several npm packages:

``` bash
npm install --save-dev bosonic-core-elements
```
``` bash
npm install --save-dev bosonic-dnd-elements
```
``` bash
npm install --save-dev bosonic-data-elements
```

They're available as ZIP files too.