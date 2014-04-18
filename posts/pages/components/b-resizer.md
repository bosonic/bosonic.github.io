{
	title: "b-resizer", 
	type: "static", 
	section: "components"
}

# &lt;b-resizer&gt;

A [Bosonic](http://bosonic.github.io) element which may be used to add resizable behavior to an element.

[Check the demo](http://bosonic.github.io/demos.html).

## Install

This element is available as a npm package, see the [Bosonic documentation](http://bosonic.github.io/documentation.html) for Bosonic transpiler usage.

```sh
$ npm install --save b-resizer
```

Otherwise, you can download and include in your HTML file the builded CSS & JS files, alongside with Bosonic polyfills, as described in the [Getting Started](http://bosonic.github.io/getting-started.html) guide.

## Usage

```html
<div class="container">
    <div class="container-content">
        Lorem ipsum dolor sit amet, ...
    </div>
    <b-resizer>
</div>
```

`<b-resizer>` resizes its parent element in a bidirectional way by default.

## API

### Attributes
- __direction__: sets the resize direction (`left`, `right`, `top` or `bottom`).

