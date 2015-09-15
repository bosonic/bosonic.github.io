{
  title: "Sortable",
  element: 'b-sortable',
  category: "elements",
  section: "dnd",
  order: 1
}
# b-sortable

An element which enable a group of DOM elements to be sortable.

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