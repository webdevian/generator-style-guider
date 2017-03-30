'use strict'
const AppGenerator = require('../app')

/**
 * Yeoman generator for individual components
 * @type {Class}
 */
module.exports = class extends AppGenerator {
  /**
   * Yeoman prompting
   */
  prompting () {
    this.log('Creating a new component for your style-guider!')
    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'Name of your component:'
    }, {
      type: 'confirm',
      name: 'mixin',
      message: 'Will the component have a Pug mixin?',
      default: true
    }, {
      type: 'confirm',
      name: 'scss',
      message: 'Will the component have any CSS?',
      default: true
    }, {
      type: 'confirm',
      name: 'js',
      message: 'Will the component have any JS?',
      default: true
    }, {
      type: 'confirm',
      name: 'docs',
      message: 'Add new component to docs?',
      default: true
    }]

    return this.prompt(prompts).then(props => {
      // Get parent project name for later use
      props.projectName = this.options.projectName || this.config.get('name')
      props.longName = props.name

      // Set name to slug, so it can be used in filenames
      props.name = this._slugName(props.name)

      this.props = props

      // Add to components object in config
      const components = this.config.get('components') || {}
      components[props.name] = props
      this.config.set('components', components)
    })
  }

  /**
   * Yeoman writing
   */
  writing () {
    // Create the schema entry
    this._template('schema.js', 'schema/components/' + this.props.name + '.js', this.props)

    if (this.props.docs) {
      // Add to the menu array in the docs schema
      this._insert(
        'schema/docs.js',
        '// ------ yeoman include hook ------ //',
        '    \'' + this.props.name + '\': [],',
        true
      )
    }

    if (this.props.mixin) {
      // Create pug file with mixin
      this._template('mixin.pug', 'pug/components/_' + this.props.name + '.pug', this.props)

      // Add mixin include to mixins file
      this._insert(
        'pug/_mixins.pug',
        '//------ yeoman hook ------ //',
        'include components/_' + this.props.name + '.pug'
      )
    }

    if (this.props.js) {
      // Create js file
      this._template('script.js', 'js/components/_' + this.props.name + '.js', this.props)
    }

    if (this.props.scss) {
      // Create scss file with mixin
      this._template('style.scss', 'scss/components/_' + this.props.name + '.scss', this.props)

      // Add to the list of scss file imports
      this._insert(
        'scss/' + this.props.projectName + '.scss',
        '//------ yeoman import hook ------ //',
        '@import \'components/' + this.props.name + '\';'
      )

      // Add to the list of scss mixins
      this._insert(
        'scss/' + this.props.projectName + '.scss',
        '//------ yeoman include hook ------ //',
        '@include ' + this.props.projectName + '-' + this.props.name + ';',
        false,
        1
      )
    }
  }

  /**
   * Yeoman install step (Avoid inheriting parent method)
   */
  install () {
    return true
  }
}
