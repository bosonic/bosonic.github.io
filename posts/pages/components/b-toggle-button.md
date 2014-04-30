{
	title: "b-toggle-button", 
	type: "static", 
	section: "components"
}

# &lt;b-toggle-button&gt;

A [Bosonic](http://bosonic.github.io) element which represents a state or option that can be toggled.

[Check the demo](http://bosonic.github.io/demos.html).

## Install

This element is available as a npm package, see the [Bosonic documentation](http://bosonic.github.io/documentation.html) for Bosonic transpiler usage.

```sh
$ npm install --save b-toggle-button
```

Otherwise, you can download and include in your HTML file the builded CSS & JS files, alongside with Bosonic polyfills, as described in the [Getting Started](http://bosonic.github.io/getting-started.html) guide.

## Usage

The `checked` attribute indicates the state ON of the toggle button.

```html
<b-toggle-button checked></b-toggle-button>
```

The `nocaption` attribute removes the default ON/OFF caption of the button.

```html
<b-toggle-button nocaption></b-toggle-button>
```

The `oncaption` and `offcaption` attributes let you change the caption of the button. If the caption is too long, use a padding-right and padding-left directive to adapt the size of the toggle-button
```html
<b-toggle-button style="padding: 0 15px" oncaption="activated" offcaption="deactivated"></b-toggle-button>
```

The user can use the keyboard to toggle the button: SPACE/ENTER.

You can control the b-toggle-button with javascript:
```javascript
var toggleButton = document.querySelector('b-toggle-button');

toggleButton.activate(); // activate
toggleButton.deactivate(); // deactivate
toggleButton.toggle(); // toggle

toggleButton.value; // returns a boolean
toggleButton.checked; // returns a boolean
toggleButton.checked = true; // activate the button
toggleButton.checked = false; // deactivate the button
```

The b-toggle-button can be styled:
```css
b-toggle-button.kitkat {
    border-radius: 0;
    border: 0;
}
b-toggle-button.kitkat.on {
    border: 0;
}
b-toggle-button.kitkat .b-toggle-on {
    background-color: #27A1CA;
}
b-toggle-button.kitkat .b-toggle-off {
    background-color: #A1A1A1;
    color: #333333;
}
b-toggle-button.kitkat .b-toggle-thumb {
    width: 30px;
    left: calc(50% - 15px);
    background-color: #333333;
    border-radius: 0;
}
```