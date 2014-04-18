{
	title: "b-draggable", 
	type: "static", 
	section: "components"
}

# &lt;b-draggable&gt;

A [Bosonic](http://bosonic.github.io) element which may be used to add draggable behavior to an element.

[Check the demo](http://bosonic.github.io/demos.html).

## Install

This element is available as a npm package, see the [Bosonic documentation](http://bosonic.github.io/documentation.html) for Bosonic transpiler usage.

```sh
$ npm install --save b-draggable
```

Otherwise, you can download and include in your HTML file the builded CSS & JS files, alongside with Bosonic polyfills, as described in the [Getting Started](http://bosonic.github.io/getting-started.html) guide.

## Usage

```html
<b-draggable handle=".drag-handle">
    <div>
        <div class="drag-handle"></div>
        <p>Lorem ipsum...</p>
    </div>
</b-draggable>
```

## API

### Attributes
- __handle__: a CSS selector that points to the element to be used to drag the object (defaults to the whole object).
- __axis__: constrains the draggability along an axis (`x` or `y`).
- __containement__: specifies an element that defines the boundaries of the draggable area: `parent` or `<selector>`.
