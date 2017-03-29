'use strict'

/**
 * Component configuration
 * The data in these component configuration files ties together the
 * SCSS, JS and Pug markup for each component and is used by the docs generator
 * (in gulp) to build up documentation, including live demos
 * @type {Object}
 */

module.exports = {
  // Component name, should match schema, pug, scss and js filename
  name: 'example',

  // Component title - for docs/style guide
  title: 'My Example Component',

  // Paragraphs for docs. Array of strings. Each string will be a separate paragraph, inline pug will be rendered
  docs: [
    'This is an example component, it includes some CSS (compiled from SCSS), some JS, and a pug mixin to make the markup easily re-usable',
    'These paragraphs are generated from the example component schema, in #[code schema/components/example.js]'
  ],

  // Path to mixin (if not pug/components/<component_name>.pug)
  // Set to false if there is no mixin for this component
  // mixinPath: null,

  // Path to scss (if not scss/components/<component_name>.scss)
  // Set to false if there is no scss for this component
  // scssPath: null,

  // Path to js (if not js/components/<component_name>.js)
  // Set to false if there is no js for this component
  // jsPath: null,

  // Does this component break out of the content wrapper in the docs
  // If so, the generator with wrap a .breakout div around the demo
  breakout: false,

  // Can the component live preview be shown inline or does it require full width
  inline: true,

  // Default mixin block content for live preview (Can contain pug)
  // Set to false if there is no block
  block: false,

  // Can attributes be passed to the pug mixin?
  attributes: false,

  // Demo output (Mixin can be called, if left empty default parameters and block content will be used)
  demo: `+example('text', 'example-text', null, 'example-text', 'An example text field', 'A helper or example for this field', false)(my-attribute='true')`,

  /**
   * Pug Mixin Parameters
   * Object with parameter documentation for the mixin. In the following format
    paramName: {
      type: 'string', // Can be string, boolean, number, array or object
      enum: [], // Array of possible strings (shows a select drop down in docs preview)
      default: true // Default value, for demonstration purposes / live preview
      description: '' // Description of field for documentation
    }
   */
  params: {
    type: {
      enum: [ 'text', 'date', 'datetime', 'datetime-local', 'email', 'month', 'number', 'password', 'search', 'tel', 'time', 'url', ' week' ],
      default: 'text',
      description: 'The input type attribute'
    },
    name: {
      type: 'string',
      default: 'my-input',
      description: 'The name attribute of the input'
    },
    value: {
      type: 'string',
      default: null,
      description: 'The default value of the field'
    },
    id: {
      type: 'string',
      default: 'my-input',
      description: 'The id of the input'
    },
    label: {
      type: 'string',
      default: 'My Input',
      description: 'The label text'
    },
    helperBelow: {
      type: 'string',
      default: 'Some helpful advice for this field',
      description: 'Helper that appears below the field'
    },
    helperAbove: {
      type: 'string',
      default: 'More helpful advice for this field',
      description: 'Helper the appears above the field'
    },
    error: {
      type: 'string',
      default: null,
      description: 'Error message string, marks whole field as errorneous'
    }
  }
}
