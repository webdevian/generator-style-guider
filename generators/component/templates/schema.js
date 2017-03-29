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
  name: '<%- name %>',

  // Component title - for docs/style guide
  title: '<%- longName %>',

  // Paragraphs for docs. Array of strings. Each string will be a separate paragraph, inline pug will be rendered
  docs: [
    'Component documentation for <%- longName %> goes here'
  ],

  // Demo output (Mixin can be called, if left empty default parameters and block content will be used)
  demo: `+<%- name %>()`,

  // Does this component break out of the content wrapper in the docs
  // If so, the generator with wrap a .breakout div around the demo
  breakout: false,

  <% if (scss) { %>// Path to scss (if not scss/components/<component_name>.scss)
  // Set to false if there is no scss for this component
  // scssPath: null,<% } %>

  <% if (js) { %>// Path to js (if not js/components/<component_name>.js)
  // Set to false if there is no js for this component
  // jsPath: null,<% } %>

  <% if (mixin) { %>// Path to mixin (if not pug/components/<component_name>.pug)
  // Set to false if there is no mixin for this component
  // mixinPath: null,

  // Can the component live preview be shown inline or does it require full width
  inline: true,

  // Default mixin block content for live preview (Can contain pug)
  // Set to false if there is no block
  block: false,

  // Can attributes be passed to the pug mixin?
  attributes: false,

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
    param: {
      type: '',
      default: '',
      description: ''
    }
  }<% } %>
}
