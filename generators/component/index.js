'use strict'
const Generator = require('yeoman-generator')
const slugify = require('slugify')

module.exports = class extends Generator {
  prompting () {
    this.log('Creating a new component for your style-guider!')
    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'Name of your component'
    }]

    return this.prompt(prompts).then(props => {
      const slug = slugify(props.name).toLowerCase()

      props.longName = props.name

      if (slug !== props.name) {
        this.log(`Converting name to url friendly format: '${props.name} => '${slug}'`)
        props.name = slug
      }

      this.props = props
    })
  }

  writing () {
    // this.fs.copyTpl(
    //   this.templatePath('dummyfile.txt'),
    //   this.destinationPath('dummyfile.txt'),
    //   this.props
    // )
  }
}
