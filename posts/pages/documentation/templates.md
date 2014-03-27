{
  title: "Templates",
  type: "static",
  section: "documentation",
  order: 3
}

## Templates

If you put some markup in the `<template>` section, you will have access to a `this.template` property in your `<script>`, which is a polyfilled HTML template element. We will use this to bring more content on screen with our element:

``` html
<element name="b-hello-world">
    <style>    
    </style>
    <template>
        <h3>Hello, world!</h3>
        <p>Lorem ipsum</p>
    </template>
    <script>
        ({
            createdCallback: function() {
                this.appendChild(this.template.content.cloneNode(true));
            }
        });
    </script>
</element>
```