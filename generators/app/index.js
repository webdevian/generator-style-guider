'use strict'
const Generator = require('yeoman-generator')
const path = require('path')
const mkdirp = require('mkdirp')
const slugify = require('slugify')

module.exports = class extends Generator {
  initializing () {
    this.props = {}
  }

  prompting () {
    this.log('Welcome to the style-guider generator!')

    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'Your style guide name (Used in title and filenames)',
      default: path.basename(process.cwd()),
      store: true
    }, {
      type: 'list',
      name: 'depManager',
      message: 'User NPM or Yarn to manage dependencies?',
      choices: ['npm', 'yarn'],
      default: 'npm',
      store: true
    }, {
      type: 'confirm',
      name: 'husky',
      message: 'Install Useful git hooks (with husky)?',
      default: true,
      store: true
    }]

    return this.prompt(prompts).then(props => {
      const slug = slugify(props.name).toLowerCase()

      props.longName = props.name

      if (slug !== props.name) {
        this.log(`Converting name to url friendly format: '${props.name} => '${slug}'`)
        props.name = slug
      }

      props.yarn = props.depManager === 'yarn'
      props.npm = props.depManager === 'npm'

      this.props = props
      this.config.set(props)
    })
  }

  default () {
  }

  writing () {
    this.fs.copyTpl(
      this.templatePath('root/.*'),
      this.destinationPath(''),
      this.props
    )

    this.fs.copyTpl(
      this.templatePath('root/*'),
      this.destinationPath(''),
      this.props
    )

    this.fs.copyTpl(
      this.templatePath('docs/**/*'),
      this.destinationPath('docs'),
      this.props
    )

    this.fs.copy(
      this.templatePath('img/.gitkeep'),
      this.destinationPath('img/.gitkeep'),
      this.props
    )

    this.fs.copyTpl(
      this.templatePath('schema/**/*'),
      this.destinationPath('schema'),
      this.props
    )

    this.fs.copyTpl(
      this.templatePath('pug/**/*'),
      this.destinationPath('pug'),
      this.props
    )

    this.fs.copyTpl(
      this.templatePath('js/**/*'),
      this.destinationPath('js'),
      this.props
    )

    this.fs.copyTpl(
      this.templatePath('scss/**/*'),
      this.destinationPath('scss'),
      this.props
    )

    this.fs.copy(
      this.destinationPath('scss/app.scss'),
      this.destinationPath('scss/' + this.props.name + '.scss')
    )

    this.fs.delete(this.destinationPath('scss/app.scss'))
  }

  install () {
    if (this.props.husky) {
      this.spawnCommandSync('git', ['init', '--quiet'])
    }
    if (this.props.yarn) {
      this.spawnCommandSync('yarn', ['install'])
      this.spawnCommandSync('yarn', ['run', 'build'])
    } else {
      this.spawnCommandSync('npm', ['install', '--silent'])
      this.spawnCommandSync('npm', ['run', '--silent', 'build'])
    }
  }
}
