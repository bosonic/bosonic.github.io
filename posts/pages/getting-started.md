{
  title: "Getting Started",
  type: "static"
}

# Getting Started

## How to use a web component ?

To start with Bosonic, download the [bosonic core library](https://github.com/bosonic/bosonic/raw/master/dist/bosonic.js) and the [bosonic polyfills](https://github.com/bosonic/bosonic/raw/master/dist/bosonic-polyfills.js) in order to support the oldest browsers (Shadow DOM unsupported).

Or you can just enter commands below:

``` bash
# In your application javascript folder
wget https://github.com/bosonic/bosonic/raw/master/dist/bosonic-polyfills.js
wget https://github.com/bosonic/bosonic/raw/master/dist/bosonic.js
```

Add script links in your HTML file.


To check if Bosonic is correctly installed, we will use a ["HelloWorld" Bosonic web component](https://github.com/bosonic/b-hello-world/raw/master/dist/b-hello-world.js) or you can choose the Bosonic web components you need ([Bosonic web components list](documentation.html)).

Or you can just enter commands below:

``` bash
# In your application javascript folder
wget https://github.com/bosonic/b-hello-world/raw/master/dist/b-hello-world.js

# In your application css folder
wget https://github.com/bosonic/b-hello-world/raw/master/dist/b-hello-world.css
```

Add links to the web component javascript and css files in your HTML file.

Your final HTML file should look like this:

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

	<b-hello-world>
	</b-hello-world>

</body>
</html>

```

## How to build a web component ?

Bosonic web components is developed as close as the [W3C _work in progress_ standards](http://www.w3.org/TR/components-intro). The W3C describes web components which consist of five pieces:

- __Templates__, which define chunks of markup that are inert but can be activated for use later.
- __Decorators__, which apply templates based on CSS selectors to affect rich visual and behavioral changes to documents.
- __Custome Elements__, which let authors define their own elements, with new tag names and new script interfaces.
- __Shadow DOM__, which encapsulates a DOM subtree for more reliable composition of user interface elements.
- __Imports__, which defines how templates, decorators and custom elements are packaged and loaded as a resource.

Below we will describe how Bosonic handles thoses specifications to give web developers the most awesome experience.

### Prerequisites

Bosonic core is based on several [Nodes.js](http://nodejs.org/) packages:

``` json
    "grunt",
    "grunt-contrib-watch",
    "grunt-contrib-clean",
    "grunt-contrib-concat",
    "karma",
    "grunt-karma",
    "mocha",
    "karma-mocha",
    "chai",
    "karma-chai",
    "karma-chrome-launcher",
    "karma-firefox-launcher"
```

But we like to provide you the most simple experience, then we use [Yeoman](http://yeoman.io/) to bootstrap a new web component.

The next chapter wiil guide you through the creation of a web component.

### Step by step

The first thing to do is to install Node.js ([platform specific installation instructions](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)).

Once Nodejs and npm are installed, just enter the following commands:

``` bash
npm install -g yo generator-bosonic
mkdir my-awesome-bosonic-component && cd $_
yo bosonic
# follow yeoman instructions
```

Yeoman build automaticcaly the layout of a Bosnic component which is standardized to keep things as simple as possible. A standard component looks like this:

``` bash
└── my-awesome-bosonic-component
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