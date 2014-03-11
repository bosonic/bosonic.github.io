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


To check if Bosonic is correctly installed, we will use a ["HelloWorld" Bosonic web component](https://github.com/bosonic/b-flash-message/raw/master/dist/b-flash-message.js) or you can choose the Bosonic web components you need ([Bosonic web components list](documentation.html)).

Or you can just enter commands below:

``` bash
# In your application javascript folder
wget https://github.com/bosonic/b-flash-message/raw/master/dist/b-flash-message.js

# In your application css folder
wget https://github.com/bosonic/b-flash-message/raw/master/dist/b-flash-message.css
```

Add links to the web component javascript and css file and .

Your final HTML file should look like this:

``` html
<!DOCTYPE html>
<html>
<head>
    <title>My Application</title>
    <meta charset="utf-8">
    <script src="assets/js/bosonic-polyfills.js"></script>
    <script src="assets/js/bosonic.js"></script>
    <script src="assets/js/b-flash-message.js"></script>
    <link rel="stylesheet" href="assets/css/b-flash-message.css">
</head>
<body>

	<b-flash-message type="success" visible>
		<strong>Congrats!</strong> Bosonic is successful installed!
	</b-flash-message>

</body>
</html>

```

## How to build a web component ?

### Prerequisites

### Step by step
