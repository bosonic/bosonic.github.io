{
  title: "Getting the code",
  category: "documentation",
  section: "Getting started",
  order: 1
}

# Getting the code

## Bosonic install

As of now, the preferred, recommended and... only way to install Bosonic is through npm. We'll probably add other options when the 1.0 will be released.

<div class="contribute-tip">
    <h6>Want to help?</h6>
    <p>You could help by taking responsibility of, say, Bower packaging ;)</p>
</div>

### With npm

We'll assume you've already installed Node.js and npm ([platform specific installation instructions](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)).

If you've just setup your project and haven't a `package.json` file, it's time to generate one:

``` bash
npm init
```

You can now install the Bosonic package:

``` bash
npm install --save-dev bosonic
```

## Installing elements

Bosonic's elements are grouped in several npm packages:

``` bash
npm install --save-dev bosonic-core-elements
```