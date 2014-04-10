{
	title: "b-dialog", 
	type: "static", 
	section: "components"
}

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
