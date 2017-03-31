# Style Guider
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage][coveralls-image]][coveralls-url] [![Code Climate][codeclimate-image]][codeclimate-url]
> Generate a re-usable web framework, with a digital style guide, for your organisation or project

## Demo

View a [demo style guide](https://webdevian.github.io/style-guider-demo/) built with Style Guider, and [its source code](https://github.com/webdevian/style-guider-demo/)

## Features

* Build a CSS, Javascript and Pug framework to be re-used across multiple projects.
* Generate a Style Guide / Documentation for your framework, with live interactive previews of each component.
* Built-in linting
* Use NPM or Yarn to manage dependencies.

##### Coming soon 

* Bootstrap, Foundation or VanillaCSS options (currently foundation is default)
* JS framework options
* HTMl template language options (Pug, Handlebars, EJS etc)

## Installation

First, install [Yeoman](http://yeoman.io) and generator-style-guider using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-style-guider
```

Then generate your new project:

```bash
yo style-guider
```

### Adding components

Add new components for your style guide:
```bash
yo style-guider:component
```
## License

MIT © Ian Egner


[npm-image]: https://badge.fury.io/js/generator-style-guider.svg
[npm-url]: https://npmjs.org/package/generator-style-guider
[travis-image]: https://travis-ci.org/webdevian/generator-style-guider.svg?branch=master
[travis-url]: https://travis-ci.org/webdevian/generator-style-guider
[daviddm-image]: https://david-dm.org/webdevian/generator-style-guider.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/webdevian/generator-style-guider
[coveralls-image]: https://coveralls.io/repos/webdevian/generator-style-guider/badge.svg
[coveralls-url]: https://coveralls.io/r/webdevian/generator-style-guider
[codeclimate-image]: https://codeclimate.com/github/webdevian/generator-style-guider/badges/gpa.svg
[codeclimate-url]: https://codeclimate.com/github/webdevian/generator-style-guider
