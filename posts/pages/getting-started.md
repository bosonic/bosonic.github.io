{
  title: "Getting Started",
  type: "static"
}

# Getting Started

## Using Bosonic elements

To start with Bosonic, download the [bosonic core library](https://github.com/bosonic/bosonic/raw/master/dist/bosonic.js) and the [bosonic polyfills](https://github.com/bosonic/bosonic/raw/master/dist/bosonic-polyfills.js). You need to load the polyfills script before the core library in the browser.

For our first use of Bosonic, we will use a ["HelloWorld" Bosonic element](https://github.com/bosonic/b-hello-world) but you can choose the Bosonic elements you need (unfortunately, we don't have a full list and documentation page yet. Please go to the [Github organization page](https://github.com/bosonic) to view the currently available elements. More coming very soon!).

Grab the [CSS](https://raw.githubusercontent.com/bosonic/b-hello-world/master/dist/b-hello-world.css) and [JS](https://raw.githubusercontent.com/bosonic/b-hello-world/master/dist/b-hello-world.js) builded files.

Your HTML file should look like this:

``` html
<!DOCTYPE html>
<html>
<head>
    <title>My Application</title>
    <meta charset="utf-8">
    <script src="assets/js/bosonic-polyfills.js"></script>
    <script src="assets/js/bosonic.js"></script>
    <script src="assets/js/b-hello-world.js"></script>
    <link rel="stylesheet" href="assets/css/b-hello-world.css">
</head>
<body>

	<b-hello-world></b-hello-world>

</body>
</html>

```

Load the HTML file in your favorite browser, and you should see a terrific red Hello World ;)

## Creating Bosonic elements

Bosonic elements are developed as close as possible to the [W3C Introduction to Web Components draft](http://www.w3.org/TR/components-intro). The Web Components model consists of five pieces:

- __[Templates](http://www.w3.org/TR/components-intro/#template-section)__, which define chunks of markup that are inert but can be activated for later use.
- __[Decorators](http://www.w3.org/TR/components-intro/#decorator-section)__, which apply templates based on CSS selectors for rich visual and behavioral changes to documents.
- __[Custom Elements](http://www.w3.org/TR/components-intro/#custom-element-section)__, which let authors define their own elements, with new tag names and associated beahavior and API.
- __[Shadow DOM](http://www.w3.org/TR/components-intro/#shadow-dom-section)__, which encapsulates a DOM subtree for reliable composition of user interface elements.
- __[Imports](http://www.w3.org/TR/components-intro/#imports-section)__, which defines how templates, decorators and custom elements are packaged and loaded as a resource.

Below we will describe how Bosonic handles thoses specifications to give web developers the most awesome experience.

### Prerequisites

Bosonic is made of several packages:

- __[Bosonic core library](https://github.com/bosonic/bosonic)__, which consists of a runtime and various polyfills.
- __[Bosonic transpiler](https://github.com/bosonic/transpiler)__, which is a [Node.js](http://nodejs.org/) module that transforms elements' HTML files into JS & CSS ones.
- __[grunt-bosonic](https://github.com/bosonic/grunt-bosonic)__, which is a [Grunt](http://gruntjs.com/) task that uses the transpiler to build your elements.
- __[yeoman-bosonic](https://github.com/bosonic/yeoman-bosonic)__, which is a [Yeoman](http://yeoman.io/) generator that creates the skeleton of a new element.

All these [components](https://www.npmjs.org/search?q=bosonic), like all Bosonic elements, are (or will be) available as [npm](https://www.npmjs.org/) packages.

To keep things simple, we will use [Yeoman](http://yeoman.io/) to bootstrap our new element.

### Step by step

The first thing to do is to install Node.js ([platform specific installation instructions](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)).

Once Node.js and npm are installed, enter the following commands:

``` bash
npm install -g yo generator-bosonic
mkdir b-hello-world && cd $_
yo bosonic
# follow yeoman instructions
npm install
```

Yeoman will generate the layout of your new element, which is standardized to keep things as simple as possible. A standard component looks like this:

``` bash
└── b-hello-world
    ├── .gitignore                  # A ready to push .gitignore file
    ├── demo/                       # Write your demo here. Run: grunt demo
    ├── dist/                       # JS and CSS are generated here
    ├── node_modules/               # Bononic dependencies
    ├── src/                        # Write your code here
    ├── test/                       # Write your test here. Run: grunt karma
    ├── Gruntfile.js                # Grunt configuration
    ├── karma.conf.js               # Test configuration
    ├── LICENSE                     # MIT Licence
    ├── package.json                # Dependencies configuration
    └── README.md
```

#### Hello World!

First, go to the `src/` directory and open `b-hello-world.html`:

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

In this file, you can find the different parts of a custom element :

- `<element`, which encapsulates the custom element definition.
- `<style>`, for the css code.
- `<template>`, useful to build the markup of your element.
- `<script>`, for the javascript code that defines the behavior and API of your element.

Then go to the `demo/` directory and open the `index.html` file:

``` html
<!DOCTYPE html>
<html>
<head>
    <title>Demo</title>
    <meta charset="utf-8">
    <script src="js/bosonic-polyfills.js"></script>
    <script src="js/bosonic.js"></script>
    <script src="js/b-hello-world.js"></script>
    <link href="css/b-hello-world.css" rel="stylesheet">
</head>
<body>
    
    <script type="text/javascript">
        
    </script>
</body>
```

Notice the `<head>` tag: Bosonic needs two core javascript files alongside your element javascript and css files, which are generated by a Grunt task from the `src/b-hello-world.html`.

Go back in the terminal and type the following command to generate the `dist/` files and start a demo web server:

``` bash
grunt demo
```

Of course, nothing will display yet. It's time to start building your element ! 

Continue on to the [documentation](documentation.html).

