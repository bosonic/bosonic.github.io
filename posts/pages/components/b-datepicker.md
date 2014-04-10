{
	title: "b-datepicker", 
	type: "static", 
	section: "components"
}

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

