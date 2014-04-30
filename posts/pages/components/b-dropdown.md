{
	title: "b-dropdown", 
	type: "static", 
	section: "components"
}

# &lt;b-dropdown&gt;

A [Bosonic](http://bosonic.github.io) dropdown element.

## Install

This element is available as a npm package, see the [Bosonic documentation](http://bosonic.github.io/documentation.html) for Bosonic transpiler usage.

```sh
$ npm install --save b-dropdown
```

Otherwise, you can download and include in your HTML file the builded CSS & JS files, alongside with Bosonic polyfills, as described in the [Getting Started](http://bosonic.github.io/getting-started.html) guide.

## Usage

Basically, a `<b-dropdown>` element wraps an unordered list into a dropdown menu, hidden by default and showable by adding a `open` attribute or via the API:

```html
<button id="toggle">Dropdown</button>
<b-dropdown>
    <ul>
        <li>plain text</li>
        <li><a href="#">link item</a></li>
        <hr />
        <li><a href="#">separated link</a></li>
    </ul>
</b-dropdown>
```
```js
window.addEventListener('WebComponentsReady', function() {
    document.querySelector('#toggle').addEventListener('click', function(e) {
        e.stopPropagation();
        document.querySelector('b-dropdown').toggle();
    });
});
```

You're not forced to use JavaScript, though. Adding a `data-b-dropdown-toggle` attribute to a link or a button, with the ID of the dropdown as value, will make the link or button toggle the dropdown:

```html
<button data-b-dropdown-toggle="foo">Dropdown</button>
<b-dropdown id="foo">
    <ul>
        <li>plain text</li>
        <li><a href="#">link item</a></li>
        <hr />
        <li><a href="#">separated link</a></li>
    </ul>
</b-dropdown>
```
