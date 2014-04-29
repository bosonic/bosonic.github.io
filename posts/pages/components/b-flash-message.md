{
	title: "b-flash-message", 
	type: "static", 
	section: "components"
}

# &lt;b-flash-message&gt;

A [Bosonic](http://bosonic.github.io) flash message element with four different levels.

[Check the demo](http://bosonic.github.io/demos.html).

## Install

This element is available as a npm package, see the [Bosonic documentation](http://bosonic.github.io/documentation.html) for Bosonic transpiler usage.

```sh
$ npm install --save b-flash-message
```

Otherwise, you can download and include in your HTML file the builded CSS & JS files, alongside with Bosonic polyfills, as described in the [Getting Started](http://bosonic.github.io/getting-started.html) guide.

## Usage

``` html
<b-flash-message visible="true" type="info" closeable="true" duration="2000">
    <strong>Hello, World!</strong> Foo Bar
</b-flash-message>
```

Will display a info flash message during 2 secs containing the string "Hello, World! Foo Bar".

## API

### Attributes
- __visible__: controls the display of the message. Valid values are `true` or `false`. By default it is set to `false`.
- __closeable__: adds a button to let the user close the flash message. Valid values are `true` or `false`. By default it is set to `false`.
- __type__: four possible values: `info`, `success`, `warning` and `error`, respectively blue, green, yellow and red. By default this attribute is set to `info`.
-__duration__: Trigger a timeout when the message is displayed (see `show` accessor). Valid value is a number given in milliseconds.

### Methods
- __show()__: displays the flash message. If the attribute `duration` is set to a valid value, the message will be hidden automatically after specified number of milliseconds.
- __close()__: hides the flash message.

### Events
- __b-flash-message-show__: will fire when the flash message is shown.
- __b-flash-message-close__: will fire when the flash message is closed.