'use strict'
const Generator = require('yeoman-generator')
const path = require('path')
const slugify = require('slugify')

/**
 * Yeoman generator for main app
 * @type {Class}
 */
module.exports = class extends Generator {
  /**
   * Yeoman init
   */
  initializing () {
    this.props = {}
  }

  /**
   * Yeoman prompting
   */
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
      props.longName = props.name

      // Set name to slug, so it can be used in filenames
      props.name = this._slugName(props.name)
      props.yarn = props.depManager === 'yarn'
      props.npm = props.depManager === 'npm'

      this.props = props
      this.config.set(props)
    })
  }

  /**
   * Yeoman writing. Copy over all root files and
   * set up the folder structure
   */
  writing () {
    this._template([
      'root/.*',
      'root/*',
      'docs/**/*',
      'img/.gitkeep',
      'schema/**/*',
      'pug/**/*',
      'js/**/*',
      'scss/**/*'
    ], [
      '',
      '',
      'docs',
      'img/.gitkeep',
      'schema',
      'pug',
      'js',
      'scss'
    ], this.props)

    this.fs.move(
      this.destinationPath('package.json.template'),
      this.destinationPath('package.json')
    )

    this.fs.move(
      this.destinationPath('scss/app.scss'),
      this.destinationPath('scss/' + this.props.name + '.scss')
    )
  }

  /**
   * Yeoman install step
   */
  install () {
    if (this.props.husky) {
      this.spawnCommandSync('git', ['init', '--quiet'])
    }
    if (this.props.yarn) {
      if (!this.options.skipInstall) {
        this.spawnCommandSync('yarn', ['install'])
        this.spawnCommandSync('yarn', ['run', 'build'])
      }
    } else {
      this.npmInstall(null, null, () => {
        if (!this.options.skipInstall) { this.spawnCommandSync('npm', ['run', '--silent', 'build']) }
      })
    }
  }

  /**
   * Check if a string needs slugifying, if it does
   * log the change
   *
   * @param  {String} name String to be slugified
   * @return {String}      Slugified string
   */
  _slugName (name) {
    const slug = slugify(name).toLowerCase()

    if (slug !== name) {
      this.log(`Converting name to url friendly format: '${name} => '${slug}'`)
    }
    return slug
  }

  /**
   * Copy template files to the work
   * destination. If data is passed,
   * run ejs
   *
   * @param  {Array|String} from file name/path to copy from
   * @param  {Array|String} to   file name/path to copy to
   * @param  {Object} data data to pass to template
   * @return promise
   */
  _template (from, to, data) {
    if (typeof from === 'string') {
      from = [from]
      to = [to]
    }
    from.forEach((str, i) => {
      this.fs.copyTpl(
        this.templatePath(from[i]),
        this.destinationPath(to[i]),
        data
      )
    })
  }

  /**
   * Add some content to a file before or after a specific marker
   * @param  {String} path   The file you want to insert into
   * @param  {String} find   The marker string
   * @param  {String} insert The string you want to insert
   * @param  {Boolean} after Should the insert string go after the hook
   * @param  {Integer} indent Does the new line need indentation, how much?
   */
  _insert (path, find, insert, after, indent) {
    const file = this.fs.read(path)
    if (!file || file.indexOf(find) !== -1) {
      if (file.indexOf(insert.replace(/,\s*$/, '')) === -1) {
        let replace
        const spaces = Array(indent).join('  ')

        if (after) {
          replace = find + '\n' + spaces + insert
        } else {
          replace = insert + '\n' + spaces + find
        }

        this.fs.write(path, file.replace(find, replace))

        this.log('Including in ' + path)
      } else {
        this.log('Duplicate found in ' + path)
      }
    } else {
      this.log('Yeoman include hook missing in ' + path)
    }
  }
}
