{
  title: "Lifecycle callbacks",
  category: "documentation",
  section: "Reference",
  order: 3
}

# Lifecycle callbacks

Lifecycle callbacks are special methods defined by the Custom Elements specification which fire when the element go through specific changes during its lifetime:

- `createdCallback()` is called when a custom element is created.
- `attachedCallback()` is called when a custom element is inserted into a DOM subtree.
- `detachedCallback()` is called when a custom element is removed from a DOM subtree.
- `attributeChangedCallback(attributeName, oldValue, newValue)` is called when a custom element's attribute value has changed.

Bosonic provides a useful feature: if you declare the attributes used by your element in the `<element>` tag, like this:
``` html
<element name="hello-world" attributes="opened active">
    ...
</element>
```

Bosonic will automatically call methods named after the attributes, i.e:
``` js
Bosonic.register({
    openedChanged: function(old, new) {}
    activeChanged: function(old, new) {}
});
```