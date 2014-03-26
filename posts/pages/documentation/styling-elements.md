{
  title: "Styling elements",
  type: "static",
  section: "documentation"
}

## Styling elements

This section describes how to style your Custom Elements, focusing essentially on how to style Shadow DOM and on how Bosonic transpiles these new CSS rules into something current browsers can understand. 

Please note that Shadow DOM spec is still a draft, and so CSS rules may change. We'll try to keep Bosonic in sync with these potential changes. 

Keep in mind that some of these rules are not easily shimable, therefore Bosonic support of these rules is limited. To be on the safe side, use only rules that are documented here.

### User-provided styles

Users of your Custom Element can define styles on it using the element's name as a selector:

``` css
b-bar {
    border: 1px solid #ccc;
}
```

It works out-of-the-box, there is no need to use Bosonic to transpile these rules.

### Styling the host element

The `:host` pseudo-class allows you to select and style an element hosting a shadow tree ; it must therefore be used to style your Custom Element from within its definition:

``` html
<element name="b-bar">
  <style>
    :host {
      /* b-bar will get a border */
      border: 1px solid #ccc;
    }
    :host:hover {
      border-color: red;
    }
  </style>
  <template>
    ...
  </template>
</element>
```

As you can see in the above example, the form `:host:<state>` allows you to provide specific styles for "classic" user-driven states.

You can use the `:host(<selector>)` functional pseudo-class to match the host if it matches the selector argument. For example:

``` html
<element name="b-bar">
  <style>
    :host(.foo) {
      border: 1px solid #ccc;
    }
  </style>
  <template>
    ...
  </template>
</element>
```
``` html
<b-bar class="foo"></b-bar>
```

### Theming an element

The `:host-context(<selector>)` functional pseudo-class matches the host element if it or any of its ancestors matches the selector argument. It can therefore be useful for theming.

``` css
:host-context(.warning) {
    background-color: red;
}
```
``` html
<body class="warning">
    <b-bar class="foo"></b-bar>
</body>
```

__Note:__ `:host-context` has recently be renamed from `:ancestor` in the spec. Bosonic still supports `:ancestor`, but you'd better use `:host-context`.

### Styling Shadow DOM markup from inside

Shadow DOM features scoped styling: styles defined inside the scope of the shadow tree don't leak into the document DOM, and document styles don't leak into the shadow DOM. 

Unfortunately, emulating scoped styling is near-to-impossible: Bosonic transpiles these styles by prepending selectors with the element tag name, but this does not enforce lower bound encapsulation. Keep that in mind when authoring your elements (more on this later).

``` html
<element name="b-bar">
  <style>
    p.warning {
      color: red;
    }
  </style>
  <template>
    <p class="warning">Bla bla</p>
  </template>
</element>
```

Bosonic will transpile this rule to:
``` css
b-bar p.warning {
    color: red;
}
```

### Styling shadow-projected content

The `::content` pseudo-element allows you to target Light DOM nodes distributed into the shadow tree using the `<content>` element:

``` html
<element name="b-bar">
  <style>
    ::content div {
      color: red;
    }
  </style>
  <template>
    <content select="div"></content>
  </template>
</element>
```
``` html
<b-bar>
    <div>This is red!</div>
</b-bar>
```

__Warning:__ Bosonic will transpile this rule to:
``` css
b-bar div {
    color: red;
}
```
It can cause two problems: one, the style will be applied to Shadow DOM divs too:

``` html
<element name="b-bar">
  <style>
    ::content div {
      color: red;
    }
  </style>
  <template>
    <content select="div"></content>
    <div>This is red too, but it shouldn't...</div>
  </template>
</element>
```
``` html
<b-bar>
    <div>This is red!</div>
</b-bar>
```

Therefore, you should use classes to avoid this problem:
``` html
<element name="b-bar">
  <style>
    ::content div {
      color: red;
    }
    div.shadow-blue {
      color: red;
    }
  </style>
  <template>
    <content select="div"></content>
    <div class="shadow-blue">This will be blue!</div>
  </template>
</element>
```
``` html
<b-bar>
    <div>This is red!</div>
</b-bar>
```

Second problem: 
``` html
<element name="b-bar">
  <style>
    ::content div {
      color: red;
    }
  </style>
  <template>
    <content select="div.foo"></content>
  </template>
</element>
```
``` html
<b-bar>
    <div id="one" class="foo">...</div>
    <div id="two">...</div>
    <div id="three" class="foo">...</div>
</b-bar>
```
In this case, only the divs with a `foo` class will be distributed (`#one` and `#three`); the `::content div` selector should therefore match only these distributed nodes. Alas, as Bosonic will transpile this selector to `b-bar div`, `#two` will be styled too. To avoid this, you should use classes to distinguish between these divs:
``` css
::content div.foo {
    color: red;
}
```