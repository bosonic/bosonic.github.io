{
	title: "Components", 
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
b-combo-box
===========

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

# &lt;b-datepicker&gt;

A [Bosonic](http://bosonic.github.io) datepicker element which uses [Pikaday](https://github.com/dbushell/Pikaday), an excellent datepicker with no dependencies by [David Bushell](https://github.com/dbushell).

[Check the demo](http://bosonic.github.io/demos.html).

## Install

This element is available as a npm package, see the [Bosonic documentation](http://bosonic.github.io/documentation.html) for Bosonic transpiler usage.

```sh
$ npm install --save b-datepicker
```

Otherwise, you can download and include in your HTML file the builded CSS & JS files, alongside with Bosonic polyfills, as described in the [Getting Started](http://bosonic.github.io/getting-started.html) guide.

## Usage

```html
<b-datepicker locale="en"></b-datepicker>
```

## API

### Attributes
- __locale__: language setting for month and weekday names.
- __format__: the default output format (it uses [Moment.js](http://momentjs.com/) for formatting.
- __firstday__: first day of the week (0: Sunday, 1: Monday, etc).
- __mindate__: the minimum/earliest date that can be selected.
- __maxdate__: the maximum/latest date that can be selected.

### Methods
- __getDate()__: returns the selected date as a JS `Date` object.

### Events
- __b-open__: will fire when the popup opens.
- __b-select__: will fire whenever the user picks a date.


# &lt;b-dialog&gt;

A [Bosonic](http://bosonic.github.io) element which can be used for popups in a web page.

[Check the demo](http://bosonic.github.io/demos.html).

## Install

This element is available as a npm package, see the [Bosonic documentation](http://bosonic.github.io/documentation.html) for Bosonic transpiler usage.

```sh
$ npm install --save b-dialog
```

Otherwise, you can download and include in your HTML file the builded CSS & JS files, alongside with Bosonic polyfills, as described in the [Getting Started](http://bosonic.github.io/getting-started.html) guide.

## Usage

```html
<b-dialog>
    <h3>Test</h3>
    <p>Hello world</p>
    <button>Close</button>
</b-dialog>
```

If you want, for example, close the dialog when the user clicks on the 'Close' button:

```js
window.addEventListener('WebComponentsReady', function() {
    var dialog = document.querySelector('b-dialog');
    var closeBtn = dialog.querySelector('button');
    closeBtn.addEventListener('click', function() {
        dialog.hide();
    }, false);
});
```

## API

### Methods
- __show()__ / __open()__: opens the dialog.
- __hide()__ / __close()__: closes the dialog.
- __showModal()__: opens the dialog in a modal way (with an overlay).

### Events
- __b-close__: fired when the dialog is closed.

b-dropdown
==========

# &lt;b-flash-message&gt;

## Overview
A flash message to display information with different levels.

## Usage

``` html
<b-flash-message visible="true" type="info" closeable="true" duration="2000">
    <strong>Hello, World!</strong> Foo Bar
</b-flash-message>
```

Will display a info flash message during 2 secs containing the string "Hello, World! Foo Bar".

## Attributes

### ___visible___

A boolean attribute that control the display of the message. Valid values are `true` or `false`. By default it is set to `false`.

### ___closeable___

A boolean attribute that adds (or not) a button to let the user closes the flash message. Valid values are `true` or `false`. By default it is set to `false`.

### ___type___

Lets you apply a theme to flash message. Four values are possible: `info`, `success`, `warning` and `error`, respectively blue, green, yellow and red. By default this attribute is set to `info`.

### ___duration___

Trigger a timeout when the message is displayed (see `show` accessor). Valid value is a number given in milliseconds. 

## Methods

### ___show___

Displays the flash message.

If the attribute `duration` is set to a valid value, the message will be hidden automatically after specified number of milliseconds.

### ___close___

Hides the flash message.

## Events

### ___show___

Fired from the flash message element after it complete it is shown.

### ___close___

Fired from the flash message element after it complete it is closed.

## Styling

> More about style later. Stay tuned.

## Misc

### Customizing the flash message

You can add any HTML code in the `<b-flash-message>` elements. You can control the display via css with the `visible` attribute or via javascript with `show()` / `close()` methods.

b-hello-world
=============

b-html-editor
=============

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

