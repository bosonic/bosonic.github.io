{
	title: "b-tabs", 
	type: "static", 
	section: "components"
}

# &lt;b-tabs&gt;

A [Bosonic](http://bosonic.github.io) element for tabs and tab panels.

## Install

This element is available as a npm package, see the [Bosonic documentation](http://bosonic.github.io/documentation.html) for Bosonic transpiler usage.

```sh
$ npm install --save b-tabs
```

Otherwise, you can download and include in your HTML file the builded CSS & JS files, alongside with Bosonic polyfills, as described in the [Getting Started](http://bosonic.github.io/getting-started.html) guide.

## Usage

For now (a better API is coming soon), the first child of `<b-tabs>` must be an unordered list that will become the tabs, and the second child must be a `div` with as many children as you have tabs:

```html
<b-tabs>
    <ul>
        <li>Tab 1</li>
        <li>Tab 2</li>
        <li>Tab 3</li>
    </ul>

    <div>
        <div>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum, nobis, beatae facere voluptates esse cupiditate sit laboriosam veniam quis facilis laborum distinctio nam ex incidunt architecto molestias eligendi optio? Sunt?
        </div>
        <div>
            Iste, reiciendis expedita officiis sequi suscipit neque ipsa! Architecto, repellendus, quam totam aliquid voluptates consequatur alias aspernatur temporibus amet dicta a modi optio nesciunt. Dicta, voluptatum in veniam consectetur vero.
        </div>
        <div>
            Nisi, ipsum fuga nostrum alias quidem deleniti dignissimos provident veniam culpa optio! Soluta, consequatur, minus corporis dolor repellat non at aperiam error nesciunt reiciendis! Omnis vitae itaque quas nostrum molestiae.
        </div>
    </div>
</b-tabs>
```
