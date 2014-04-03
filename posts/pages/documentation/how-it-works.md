{
  title: "How it works",
  type: "static",
  section: "documentation",
  order: 7
}

## How it works

Bosonic's transpiler takes Web Components in HTML files and transforms them into JS and CSS code. In order to do that, it uses some [Sweet.js](http://sweetjs.org/) macros to expand your element's script to vanilla Custom Elements:

__Your element__:

```html
<element name="b-hello-world">
    <style>
        ...
    </style>
    <template>
        ...
    </template>
    <script>
        ({
            createdCallback: function() {
                var root = this.createShadowRoot();
                root.appendChild(this.template.content.cloneNode(true));
            }
        });
    </script>
</element>
```

__Its expanded code__:

```js
var BHelloWorldPrototype = Object.create(HTMLElement.prototype, {
    createdCallback: {
        enumerable: true,
        value: function () {
            var root = this.createShadowRoot();
            root.appendChild(this.template.content.cloneNode(true));
        }
    }
});

window.BHelloWorld = document.registerElement('b-hello-world', { prototype: BHelloWorldPrototype });

Object.defineProperty(BHelloWorldPrototype, 'template', {
    get: function () {
        // code that emulates a <template> element...
    }
});
```