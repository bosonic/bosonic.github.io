{
  title: "Autocomplete",
  element: 'b-autocomplete',
  category: "elements",
  section: "data",
  order: 1
}

# b-autocomplete

## Usage

There is two ways to provide its options. Using a `<datalist>` element:

```html
<b-autocomplete list="data"></b-autocomplete>

<datalist id="data">
    <option>Foo</option>
    <option>Bar</option>
    <option>Hello</option>
    <option>World</option>
</datalist>
```
Or, using the API:

```html
<b-autocomplete></b-autocomplete>

<script>
    var ac = document.querySelector('b-autocomplete');
    ac.data = [
        {name: 'Afghanistan', code: 'AF'},
        {name: 'Åland Islands', code: 'AX'},
        {name: 'Albania', code: 'AL'}
        ...
    ];
</script>
```