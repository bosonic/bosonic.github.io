{
  title: "Using elements",
  category: "documentation",
  section: "Getting started",
  order: 2
}

# Using elements

Aside of its platform and runtime, Bosonic provides a mix of basic and advanced UI elements which you can use directly in your project.

The stable elements are grouped in the `core-elements` npm package. More packages will come with the next releases. See [Getting the code](documentation/getting-started/getting-the-code.html) for install instructions.

Assuming you've installed Bosonic and core-elements from npm, a quick-and-dirty way to test a Bosonic element would be to do the following:

``` html
<!DOCTYPE html>
<html>
<head>
    <title>My Application</title>
    <meta charset="utf-8">
    <!-- Load the platform which contains the various Web Components polyfills -->
    <script src="node_modules/bosonic/dist/bosonic-platform.js"></script>
    <!-- Load the runtime which allows for HTML imports to work with elements' *source* (not transpiled) files -->
    <script src="node_modules/bosonic/dist/bosonic-runtime.js"></script>
    <!-- Import the element you want to play with -->
    <link rel="import" href="node_modules/bosonic-core-elements/src/b-modal.html">
</head>
<body>

    <!-- Declare the element -->
    <b-modal>
        <h3>Hello, world!</h3>
    </b-modal>

    <button id="open-modal">Open</button>

    <!-- Here we add a listener on the button to open the modal when clicked -->
    <script>
        var btn = document.getElementById('open-modal');
        btn.addEventListener('click', function() {
            var modal = document.querySelector('b-modal');
            modal.show();
        }, false);
    </script>

</body>
</html>

```

That's it! There are multiple ways to run Bosonic though. But you're probably impatient to learn how to [build elements](documentation/getting-started/creating-elements.html).