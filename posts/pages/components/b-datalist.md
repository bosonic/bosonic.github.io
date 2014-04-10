{
	title: "b-datalist", 
	type: "static", 
	section: "components"
}

# &lt;b-datalist&gt;

A [Bosonic](http://bosonic.github.io) element which emulates the `<datalist>` element.

## Install

This element is available as a npm package, see the [Bosonic documentation](http://bosonic.github.io/documentation.html) for Bosonic transpiler usage.

```sh
$ npm install --save b-datalist
```

Otherwise, you can download and include in your HTML file the builded CSS & JS files, alongside with Bosonic polyfills, as described in the [Getting Started](http://bosonic.github.io/getting-started.html) guide.

## Usage

```html
<b-datalist>
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
</b-datalist>
```

## API

### Properties
- __options__: returns the `<option>` nodes (read-only).
