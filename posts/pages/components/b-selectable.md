{
	title: "b-selectable", 
	type: "static", 
	section: "components"
}

# &lt;b-selectable&gt;

A [Bosonic](http://bosonic.github.io) element which allows single (for now) selection of an item in a list.

[Check the demo](http://bosonic.github.io/demos.html).

## Install

This element is available as a npm package, see the [Bosonic documentation](http://bosonic.github.io/documentation.html) for Bosonic transpiler usage.

```sh
$ npm install --save b-collapsible
```

Otherwise, you can download and include in your HTML file the builded CSS & JS files, alongside with Bosonic polyfills, as described in the [Getting Started](http://bosonic.github.io/getting-started.html) guide.

## Usage

The `selected` attribute indicates which item element is being selected, and can also be used to select an item programmatically.

```html
<b-selectable selected="0">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
</b-selectable>
```
The `target` attribute defines a selector used to query nodes to be used for selectable items.

```html
<b-selectable target="li">
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
    </ul>
</b-selectable>
```

Whenever the selected item changes, a `b-selected` event will be fired. The user can use the keyboard to select an item: Up/Down.

If the user clicks/taps on an item, it will be selected AND then activated (a `b-activate` event will be fired just after the `b-selected`). If using keyboard, type ENTER to activate the selected item.

b-selectable is not styled.  You need to style the `b-selectable-selected` CSS class to style the selected element.

```css
.b-selectable-selected {
    background-color: #ccc;
}
```