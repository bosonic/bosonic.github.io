{
	title: "b-collapsible", 
	type: "static", 
	section: "components"
}

# &lt;b-collapsible&gt;

A [Bosonic](http://bosonic.github.io) element which adds a collapsible behavior to a block with a header.

[Check the demo](http://bosonic.github.io/demos.html).

## Install

This element is available as a npm package, see the [Bosonic documentation](http://bosonic.github.io/documentation.html) for Bosonic transpiler usage.

```sh
$ npm install --save b-collapsible
```

Otherwise, you can download and include in your HTML file the builded CSS & JS files, alongside with Bosonic polyfills, as described in the [Getting Started](http://bosonic.github.io/getting-started.html) guide.

## Usage

```html
<b-collapsible>
    <div class="b-collapsible-header">
        Header
    </div>
    <div>
        Lorem ipsum...
    </div>
</b-collapsible>
```

`b-collapsible` must wrap 2 block elements, one of which needing to have a `b-collapsible-header`. The other block will be the body, and it will appear/disappear depending on the `active` attribute of the element. Clicking on the header will toggle this active state.

## API

### Attributes
- __active__: if set, the body will expand.
- __duration__: transition duration in seconds (may be set to 0).
- __horizontal__: if set, the body will horizontally expand instead of vertically.

### Methods
- __toggle()__: toggles the active state.