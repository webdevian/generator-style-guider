'use strict'
const Generator = require('yeoman-generator')
const slugify = require('slugify')

module.exports = class extends Generator {
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
      const slug = slugify(props.name).toLowerCase()
      props.projectName = this.config.get('name')
      props.longName = props.name

      if (slug !== props.name) {
        this.log(`Converting name to url friendly format: '${props.name} => '${slug}'`)
        props.name = slug
      }

      this.props = props

      const components = this.config.get('components') || {}
      components[props.name] = props
      this.config.set('components', components)
    })
  }

  default () {
  }

  writing () {
    this.fs.copyTpl(
      this.templatePath('schema.js'),
      this.destinationPath('schema/components/' + this.props.name + '.js'),
      this.props
    )

    if (this.props.docs) {
      const hook = '// ------ yeoman include hook ------ //'
      const path = 'schema/docs.js'
      const file = this.fs.read(path)
      const insert = '    \'' + this.props.name + '\': [],'

      if (file.indexOf(hook) !== -1) {
        if (file.indexOf(insert) === -1) {
          this.fs.write(path, file.replace(hook, hook + '\n' + insert))
          this.log('Adding to Docs in ' + path)
        } else {
          this.log('Duplicate found in ' + path)
        }
      } else {
        this.log('Yeoman include hook missing in ' + path)
      }
    }
    if (this.props.mixin) {
      this.fs.copyTpl(
        this.templatePath('mixin.pug'),
        this.destinationPath('pug/components/_' + this.props.name + '.pug'),
        this.props
      )

      const hook = '//------ yeoman hook ------ //'
      const path = 'pug/_mixins.pug'
      const file = this.fs.read(path)
      const insert = 'include components/_' + this.props.name + '.pug'

      if (file.indexOf(hook) !== -1) {
        if (file.indexOf(insert) === -1) {
          this.fs.write(path, file.replace(hook, insert + '\n' + hook))
          this.log('Including in ' + path)
        } else {
          this.log('Duplicate found in ' + path)
        }
      } else {
        this.log('Yeoman include hook missing in ' + path)
      }
    }

    if (this.props.js) {
      this.fs.copyTpl(
        this.templatePath('script.js'),
        this.destinationPath('js/components/_' + this.props.name + '.js'),
        this.props
      )
    }

    if (this.props.scss) {
      this.fs.copyTpl(
        this.templatePath('style.scss'),
        this.destinationPath('scss/components/_' + this.props.name + '.scss'),
        this.props
      )

      const importHook = '//------ yeoman import hook ------ //'
      const importInsert = '@import \'components/' + this.props.name + '\';'
      const appPath = 'scss/' + this.props.projectName + '.scss'
      const appFile = this.fs.read(appPath)

      const includeHook = '//------ yeoman include hook ------ //'
      const includeInsert = '@include ' + this.props.projectName + '-' + this.props.name + ';'

      let newAppFile = appFile

      if (appFile.indexOf(importHook) !== -1) {
        if (appFile.indexOf(importInsert) === -1) {
          newAppFile = newAppFile.replace(importHook, importInsert + '\n' + importHook)
          this.log('Importing in ' + appPath)
        } else {
          this.log('Duplicate found in ' + appPath)
        }
      } else {
        this.log('Yeoman import hook missing in ' + appPath)
      }

      if (appFile.indexOf(includeHook) !== -1) {
        if (appFile.indexOf(includeInsert) === -1) {
          newAppFile = newAppFile.replace(includeHook, includeInsert + '\n' + '  ' + includeHook)
          this.log('including in ' + appPath)
        }
      } else {
        this.log('Yeoman include hook missing in ' + appPath)
      }

      this.fs.write(appPath, newAppFile)
    }
  }
}
