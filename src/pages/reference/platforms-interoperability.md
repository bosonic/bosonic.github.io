{
  title: "Platforms & interoperability",
  category: "documentation",
  section: "Reference",
  order: 3
}

# Platforms & interoperability

As we have seen, the Bosonic platform is made of 2 distinct files:

* `bosonic-platform.js`, which contains:
    * a Custom Elements polyfill by Andrea Giammarchi ;
    * Bosonic's fake Shadow DOM implementation ;
    * various polyfills for IE: Custom Events, `DOMTokenList`, `document.importNode`, ...
* `bosonic-runtime.js`, which contains:
    * Polymer's HTMLImports polyfill, and its deps (MutationObservers and WeakMap) ;
    * the Bosonic runtime, i.e. mainly its `Bosonic.register` method which add a bit of syntaxic sugar.

In development mode, you can simply include these 2 files (in this order) and HTMLImport your elements' source files.

But you can improve the performance in production by running a transpiled version of your elements without the runtime file (only `bosonic-platform.js` is required). You can generate these transpiled, vanilla JS files, by using our grunt task.

## Interoperability

By using code transformation in a build step, Bosonic enables you to generate files targeted for another platform: Polymer. Polymer versions of Bosonic elements run perfectly on the Polymer platform, which makes it possible to use Bosonic, Polymer, x-tags & Bricks elements in the same application.

## Futurability

Bosonic can also generate a version tailored for browsers that implement all the specifications (they're really close to the Polymer versions). It means that in the future, when all modern browsers will support Web Components, you'll be able to use these "native" versions of Bosonic elements without any dependency. 