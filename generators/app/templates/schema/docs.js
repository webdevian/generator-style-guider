'use strict'

/**
 * Docs configuration
 * @type {Object}
 */
module.exports = {

  /**
   * Meta data options for generated docs
   */
  meta: {
    // Title tag
    title: '<%- longName %>',
    // Include meta-basic mixin?
    basic: true,
    // Include meta-social mixin?
    social: {
      // Meta values for the meta social mixin
      url: '',
      title: '<%- longName %>',
      image: '',
      description: '',
      siteName: '<%- longName %>'
    }
  },

  /**
   * Options for including core components in the docs
   */
  options: {
    // Include no-js script
    noJs: false,
    // Include skip-link mixin
    'skipLink': false,
    // Include no-script mixin
    'noScript': false
  },

  /**
   * Introdcution text. Array of paragraphs. Each string will be a separate paragraph, inline pug will be rendered
   */
  introduction: [
    "This is the <%- longName %> CSS framework and style guide, built with #[a(href='https://www.npmjs.com/package/generator-style-guider', target='_blank') Style Guider]"
  ],

  /**
   * Set up the page structure (and menu) of your docs. Use the same name
   * as in each components schema. For example:
   *
    form: [
      'input',
      'textarea',
      'select',
    ]
   * This configurate would generate a form section, containing the input,
   * textarea and select components, where form, input, textarea and
   * select all have a schema in schema/components
   */
  menu: {
    // NB! The below line is required for our yeoman generator and should not be changed.
    // ------ yeoman include hook ------ //
    'example': []
  }
}
