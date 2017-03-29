TODO - More work on this....

# APC Branding Styles

A sass framework built on [Foundation](http://foundation.zurb.com/sites/docs/) with rules for APC brand guidelines, useful for creating responsive CSS on new projects.

## Setup

To use this framework in your projects, your computer needs:

- [NodeJS](https://nodejs.org/en/) (0.12 or greater)
- A [Sass](http://sass-lang.com/) compiler

### Installation

This framework is installed via yarn, directly from GitHub.

```bash
npm install --save https://github.com/APCOvernight/APC-brand.git
or
yarn add ssh://git@github.com/APCOvernight/APC-brand.git
```

This will install the framework and its dependencies in the node_modules directory.

Make sure that `node_modules/apc-brand/scss` is included in your `SASS_PATH`, along with `node_modules/foundation-sites/scss`

Then all you need to import the framework is:

```scss
@import 'apc-brand';

@include apc-everything;
```

Then when you compile your SASS, it will include all the CSS from the framework.

If you only want to import specific modules, your SASS might look like this:

```scss
@charset 'utf-8';

// --------------------------
// Import APC brand framework
// --------------------------
@import 'apc';

// ------------------
// Overwrite settings
// ------------------

// Path for background images
// $img-path: 'node_modules/apc-brand/img/';

// ------------------
// Include everything
// ------------------

// @include apc-everything

// ------------
// Global reset
// ------------

@include apc-reset;

// -----------------------------------------
// Global layout and typography
// -----------------------------------------

@include apc-layout;
@include apc-typography;
@include apc-accessibility;

// ---------------------
// Components - Optional
// ---------------------

@include apc-alert;
@include apc-banners;
@include apc-buttons;
@include apc-cards;
@include apc-code; // Only really useful for docs
@include apc-banners;
@include apc-footer;
@include apc-forms;
@include apc-hero;
@include apc-quick-links;
@include apc-sub-menu;
@include apc-tables;
@include apc-top-menu;
@include apc-login;
@include apc-pagination;
@include apc-breadcrumbs;
@include apc-tabs;
@include apc-datepicker;
@include apc-progress;

@include apc-animation;
```

### HTML markup with Pug

There are a variety of pug mixins included for building dynamic components. When using pug templates these can be used as shortcuts for quickly generating html markup. Make sure to add `include PATH_TO_NODE_MODULES/apc-brand/pug/_mixins.pug` to include all the mixins, and if you are using [pug-php](https://github.com/pug-php/pug) use the `'expressionLanguage' => 'js'` option.

Documentation for these mixins can be found in the style guide. For example, the following html markup can be written with a simple pug mixin.

```html
<div>
    <label for="my-input-field">My Input</label>
    <input type="text" id="my-input-field" name="my-input" value="Previously input value"/>
  <span>Some helpful advice for this field</span>
</div>
```
vs
```pug
+input('text', 'my-input', 'Previously input value', 'my-input-field', 'My Input', 'Some helpful advice for this field')
```

This has the added benefit of keeping framework markup up to date in line with scss changes.

### Javascript

The top menu, alert message, stacked table and tabs require some javascript to work. Include the script tags in your html.

```html
<script src="node_modules/jquery/dist/jquery.min.js"></script>
<script src="node_modules/apc-brand/dist/apc-brand.min.js"></script>
<!-- DatePicker only -->
<script src="node_modules/apc-brand/vendor/jquery-ui.js"></script>
```

## Static CSS Install

A static css stylesheet is included (`dist/apc-brand.min.css`) and can be used in projects but this is not recommended because:
- It includes all components, which can mean un-necessarily large file size
- Updates can't be easily applied (unlike with yarn)
- Adding your own overrides can be more difficult

# Development

### Requirements

To contribute to this project, you will need:

- [NodeJS](https://nodejs.org/en/) (0.12 or greater)
- [Git](https://git-scm.com/)

First download it with Git:

```bash
git clone git@github.com:APCOvernight/APC-brand.git
```

Then open the folder in your command line, and install the needed dependencies:

```bash
cd APC-brand
yarn install
```

Finally, run `yarn run start` to run the Sass compiler. It will re-run every time you save a Sass file.

Alternatively `yarn run build` will run the Sass compiler once

## Linting

This project adheres to code style guides for SCSS and JS, using sass-lint and eshint. To run both linters use:

```bash
yarn run lint
```

This should be done before committing any code.

## Git Hooks

There are pre-commit and pre-push hooks for linting, and building the minified files in `dist/`

## Style Guide / Documentation

Along with the framework itself, this repository contains a demonstration page that can be used as a style guide for the framework.

`index.html` contains the documentation, all new styles and markup should be demonstrated here, where they can be tested before being approved for release
