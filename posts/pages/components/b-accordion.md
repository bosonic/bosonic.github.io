{
	title: "b-accordion", 
	type: "static", 
	section: "components"
}

# &lt;b-accordion&gt;

A [Bosonic](http://bosonic.github.io) accordion element.

[Check the demo](http://bosonic.github.io/demos.html).

## Install

This element is available as a npm package, see the [Bosonic documentation](http://bosonic.github.io/documentation.html) for Bosonic transpiler usage.

```sh
$ npm install --save b-accordion
```

Otherwise, you can download and include in your HTML file the builded CSS & JS files, alongside with Bosonic polyfills, as described in the [Getting Started](http://bosonic.github.io/getting-started.html) guide.

## Usage

This element should be used in conjunction with `<b-collapsible>` elements:

```html
<b-accordion selected="1">
    <b-collapsible>
        <div class="b-collapsible-header">
            Header
        </div>
        <div>
            ...
        </div>
    </b-collapsible>
    <b-collapsible>
        ...
    </b-collapsible>
    ...
</b-accordion>
```
The `selected` attribute indicates which panel is expanded, and can also be used to expand a panel programmatically.

The user can use the keyboard to switch panels: Up/Down.
