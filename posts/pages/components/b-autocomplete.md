{
	title: "b-autocomplete", 
	type: "static", 
	section: "components"
}

# &lt;b-autocomplete&gt;

A [Bosonic](http://bosonic.github.io) autocomplete element.

## Install

This element is available as a npm package, see the [Bosonic documentation](http://bosonic.github.io/documentation.html) for Bosonic transpiler usage.

```sh
$ npm install --save b-autocomplete
```

Otherwise, you can download and include in your HTML file the builded CSS & JS files, alongside with Bosonic polyfills, as described in the [Getting Started](http://bosonic.github.io/getting-started.html) guide.

## Usage

For now, you must use it with a `b-datalist` to provide its options:

```html
<b-autocomplete list="data"></b-autocomplete>

<b-datalist id="data">
    <option>Foo</option>
    <option>Bar</option>
    <option>Hello</option>
    <option>World</option>
</b-datalist>
```

# &lt;b-combo-box&gt;

A [Bosonic](http://bosonic.github.io) combo-box element.

## Usage

For now, you must use it with a `b-datalist` to provide its options:

```html
<b-combo-box list="data"></b-autocomplete>

<b-datalist id="data">
    <option>Foo</option>
    <option>Bar</option>
    <option>Hello</option>
    <option>World</option>
</b-datalist>
```