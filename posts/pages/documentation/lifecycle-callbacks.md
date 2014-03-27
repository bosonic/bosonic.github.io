{
  title: "Lifecycle callbacks",
  type: "static",
  section: "documentation",
  order: 2
}

## Lifecycle callbacks

Lifecycle callbacks are special methods defined by the Custom Elements specification which fire when the element go through specific changes during its lifetime:

- `createdCallback()` is called when a custom element is created.
- `attachedCallback()` is called when a custom element is inserted into a DOM subtree.
- `detachedCallback()` is called when a custom element is removed from a DOM subtree.
- `attributeChangedCallback(attributeName)` is called when a custom element's attribute value has changed.

Bosonic supports another callback, `childListChangedCallback(removedNodes, addedNodes)`, which is called when a user of your element updates its DOM children. It is not defined in the spec though.

We will now use the `createdCallback()` to display something on screen:

``` js
({
    createdCallback: function() {
        this.textContent = 'Hello';
    }
});
```

If you refresh your browser, you should now see 'Hello' on screen, and if you inspect the HTML, you will see this:
``` html
<b-hello-world>
    Hello
</b-hello-world>
```

The takeaway is that `this` here refers to your element: you can therefore use all DOM methods on it.