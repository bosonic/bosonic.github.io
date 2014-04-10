{
	title: "b-sortable", 
	type: "static", 
	section: "components"
}

# &lt;b-sortable&gt;

A [Bosonic](http://bosonic.github.io) element which enable a group of DOM elements to be sortable. It uses [Sortable](http://rubaxa.github.io/Sortable/), an excellent independent lib by [Lebedev Konstantin](https://twitter.com/ibnRubaXa).

[Check the demo](http://bosonic.github.io/demos.html).

## Install

This element is available as a npm package, see the [Bosonic documentation](http://bosonic.github.io/documentation.html) for Bosonic transpiler usage.

```sh
$ npm install --save b-sortable
```

Otherwise, you can download and include in your HTML file the builded CSS & JS files, alongside with Bosonic polyfills, as described in the [Getting Started](http://bosonic.github.io/getting-started.html) guide.

## Usage

```html
<b-sortable>
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
        <li>Item 4</li>
        <li>Item 5</li>
        <li>Item 6</li>
    </ul>
</b-sortable>
```

The element will dispatch a `update` event when the user stop sorting an element and its DOM position has changed:

```js
window.addEventListener('WebComponentsReady', function() {
    var sortable = document.querySelector('b-sortable');
    sortable.addEventListener('update', function(e) {
        console.log('update', e.detail.item);
    }, false);
});
```
The event object will have a `detail.item` property that refers to the dragged element.

## License

[MIT License](http://opensource.org/licenses/MIT)

