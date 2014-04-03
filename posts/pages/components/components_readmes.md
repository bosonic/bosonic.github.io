{
	title: "Components", 
	type: "static", 
	section: "components"
}

b-collapsible
=============

b-combo-box
===========

b-datalist
==========

b-datepicker
============

b-dialog
========

b-dropdown
==========

b-flash-message
===============

b-hello-world
=============

b-html-editor
=============

b-selectable
============
This Web Component allows single (for now) selection of an item in a list.

The attribute "selected" indicates which item element is being selected, and can also be used to select an item programmatically.

```html
<b-selectable selected="0">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
</b-selectable>
```

The attribute "target" defines a selector used to query nodes to be used for selectable items.

```html
<b-selectable target="li">
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
    </ul>
</b-selectable>
```

Whenever the selected item changes, a "b-selected" event will be fired. The user can use the keyboard to select an item: Up/Down.

If the user clicks/taps on an item, it will be selected AND then activated (a "b-activate" event will be fired just after the "b-selected"). If using keyboard, type ENTER to activate the selected item.

b-selectable is not styled.  You need to style the "b-selectable-selected" CSS class to style the selected element.

```css
.b-selectable-selected {
    background-color: #ccc;
}
```
# &lt;b-sortable&gt;

A [Bosonic](http://bosonic.github.io) element which enable a group of DOM elements to be sortable. It uses [Sortable](http://rubaxa.github.io/Sortable/), an excellent independent lib by [Lebedev Konstantin](https://twitter.com/ibnRubaXa).

[Check the demo](http://bosonic.github.io/demos.html).

## Install

This element is available as a npm package, see the [Bosonic documentation](http://bosonic.github.io/documentation.html) for Bosonic transpiler usage.

```sh
$ npm install --save b-sortable
```

Otherwise, you can download and include in your HTML file the builded CSS & JS files, alongside with Bosonic runtime and polyfills, as described in the [Getting Started](http://bosonic.github.io/getting-started.html) guide.

## Usage

See the [Bosonic documentation](http://bosonic.github.io/documentation.html) for Bosonic transpiler usage.

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

