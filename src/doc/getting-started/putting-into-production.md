{
  title: "Putting into production",
  category: "documentation",
  section: "Getting started",
  order: 3
}

# Putting into production

If you use a lot of elements in your app, you'll get a lot of network requests (one for each HTML import), and that's not necessarily good for performance. It's therefore often necessary to concatenate Web Components into a single file.

## Concatenating Web Components

Polymer authors have developped a handy tool for that purpose that's called [Vulcanize](https://github.com/Polymer/vulcanize). It's a command line tool, easily integrable with your build tool of choice, that recursively pulls in all your imports, flattens their dependencies and spits out a single file.

## In the future

We have a specific build tool in the works that will leverage Vulcanize and include CSS Variables post-processing. It will be released in a few weeks, stay tuned!