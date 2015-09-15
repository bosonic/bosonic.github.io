{
  title: "Tree",
  element: 'b-tree',
  category: "elements",
  section: "dnd",
  published: false,
  order: 2
}
# b-tree

An element which can be used for a sortable tree.

**WARNING**: IE 9 not supported (drag and drop api only accept <a> element)

## Usage

```html
<b-tree draghandle=".handle">
    <ul>
        <li>Item 1</li>
        <li>
            Item 3
            <ul>
                <li><span class=""></span>Item 3.1</li>
                <li>Item 3.2</li>
            </ul>
        </li>
        <li>Item 4</li>
    </ul>
</b-tree>
```

The element will be sortable, using drag'n'drop.

## API

### Methods
- __childrenTree(endDepth, startDepth)__: Get the childrens tree, an array of node (recursive)

### Events
- __b-tree-sorted__: fired when the b-tree order has been changed.
- __b-tree-drop__: fired when an element is drop in the tree.