{
  title: "Introduction",
  type: "static",
  section: "documentation",
  order: 1
}

Bosonic's philosophy is to enable developers to build Web Components as close as possible to the current spec. Therefore, Bosonic aims to not become a dependency: ideally, when browsers will implement all Web Components spec, you'll be able to drop Bosonic and to use your components directly.

For commodity reasons, we'll start with the boilerplate element we have generated in the [Getting started](getting-started.html) section, and describe how to build a powerful element.

``` html
<element name="b-hello-world">
    <style>
        
    </style>
    <template>
        
    </template>
    <script>
        ({
            
        });
    </script>
</element>
```

First, you can see that `<element>` has a `name` attribute: it is of course mandatory, as it specifies the name of the HTML tag you’ll instantiate in markup. Per spec, it __must__ contain a "-".

Second, you can see that the `<script>` element already contains something that is called an Object Expression: it is an expression that evals to an object literal. Per spec again, this Object Expression __must__ be the last expression in your `<script>`.

All methods & properties included in this Object Expression will constitute the API of your new element. If, for example, we add a `sayHello` method:

``` js
({
    sayHello: function() {
        console.log('Hello');
    }
});
```

We put our new element in use in a HTML page:

``` html
<b-hello-world></b-hello-world>

<script>
    window.addEventListener('WebComponentsReady', function() {
        var hello = document.querySelector('b-hello-world');
        hello.sayHello();
    });
</script>
```

You will see a nice 'Hello' logged to the console!

There are two things to notice in this example:

- Custom Elements are at first `HTMLUnknownElement` and are eventually upgraded by the polyfills. It means that you have to listen to the `WebComponentsReady` event before attempting to use your elements with JavaScript.
- Custom Elements, once upgraded, behave like standard elements: they can be queried with DOM methods.


