# pristat static site generator

*This project is in its infancy. Use it at your own risk.*

---

Basically, I wanted a dead simple static site generator that played well with Prismic and didn't like the plugins for other static site generators, and found it too tedious to tie into their systems.

For many, this might not make sense, but if you just want a quick and simple way to write templates for your prismic content and generate a static site, this is for you.

---

### Structure

#### In Prismic

For your content to be rendered by pristat, it will need two fields:
```
"url" : {
  "type" : "Text",
  "config" : {
    "label" : "URL"
  }
},
"layout" : {
  "type" : "Text",
  "config" : {
    "label" : "Layout"
  }
},
```

The url field determines the URL for the page (i.e. the folder in which the index.html file will be generated). Pristat only supports "pretty" urls. No filename can be specified (URLs must start and end with a /).

The layout is the filename (sans extension) for the layout you wish to use. This must be a .pug template in the _layout directory of your project.

---

### Commands

#### `pristat init`

This will prompt you for the *V2* API URL for your Prismic repository, as well as the relative path in which to build your html. Simply run it in the root directory for your project.

#### `pristat build`

This will build your static site.