'use strict'
const path = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')
const fs = require('fs-extra')
const exec = require('child_process').exec

describe('generator-style-guider:component', () => {
  before(() => {
    return helpers.run(path.join(__dirname, '../generators/component'))
      .withPrompts({
        name: 'my-component',
        mixin: true,
        scss: true,
        js: true,
        docs: true
      })
      .withOptions({
        projectName: 'app'
      })
      .inTmpDir(dir => {
        fs.copySync(path.join(__dirname, '../generators/app/templates'), path.join(dir))
      })
  })

  it('Create new component', () => {
    assert.file([
      'scss/components/_my-component.scss',
      'js/components/_my-component.js',
      'pug/components/_my-component.pug',
      'schema/components/my-component.js'
    ])

    assert.fileContent('schema/docs.js', / {2}'my-component': \[\]/)
    assert.fileContent('pug/_mixins.pug', /include components\/_my-component.pug/)
    assert.fileContent('scss/app.scss', / {2}@include app-my-component;/)
    assert.fileContent('scss/app.scss', /@import 'components\/my-component';/)
  })
})

describe('generator-style-guider:component', () => {
  before(() => {
    return helpers.run(path.join(__dirname, '../generators/component'))
      .withPrompts({
        name: 'My Component',
        mixin: false,
        scss: false,
        js: false,
        docs: false
      })
      .inTmpDir(dir => {
        fs.copySync(path.join(__dirname, '../generators/app/templates'), path.join(dir))
      })
  })

  it('Create new component with no objects', () => {
    assert.noFile([
      'scss/components/_my-component.scss',
      'js/components/_my-component.js',
      'pug/components/_my-component.pug'
    ])

    assert.file([
      'schema/components/my-component.js'
    ])

    assert.noFileContent('schema/docs.js', / {2}'my-component': \[\]/)
    assert.noFileContent('pug/_mixins.pug', /include components\/_my-component.pug/)
    assert.noFileContent('scss/app.scss', / {2}@include app-my-component;/)
    assert.noFileContent('scss/app.scss', /@import 'components\/my-component';/)
  })
})

describe('generator-style-guider:component', () => {
  before(() => {
    return helpers.run(path.join(__dirname, '../generators/component'))
      .withPrompts({
        name: 'example',
        mixin: true,
        scss: true,
        js: true,
        docs: true
      })
      .inTmpDir(dir => {
        fs.copySync(path.join(__dirname, '../generators/app/templates'), path.join(dir))

        const scssIncludeSearch = '<%- name %>'
        const scssIncludePath = path.join(dir, 'scss/app.scss')
        let scssIncludeFile = fs.readFileSync(scssIncludePath, 'utf-8')
        fs.writeFileSync(scssIncludePath, scssIncludeFile.split(scssIncludeSearch).join('app'))
      })
      .withOptions({
        projectName: 'app'
      })
  })

  it('Re-create existing component with no objects', () => {
    assert.file([
      'schema/components/example.js',
      'scss/components/_example.scss',
      'js/components/_example.js',
      'pug/components/_example.pug'
    ])
  })
})

describe('generator-style-guider:component', () => {
  before(() => {
    return helpers.run(path.join(__dirname, '../generators/component'))
      .withPrompts({
        name: 'my Component',
        mixin: true,
        scss: true,
        js: true,
        docs: true
      })
      .inTmpDir(dir => {
        fs.copySync(path.join(__dirname, '../generators/app/templates'), path.join(dir))

        const schemaHook = '// ------ yeoman include hook ------ //'
        const schemaPath = path.join(dir, 'schema/docs.js')
        const schemaFile = fs.readFileSync(schemaPath, 'utf-8')
        fs.writeFileSync(schemaPath, schemaFile.replace(schemaHook, ''))

        const pugHook = '//------ yeoman hook ------ //'
        const pugPath = path.join(dir, 'pug/_mixins.pug')
        const pugFile = fs.readFileSync(pugPath, 'utf-8')
        fs.writeFileSync(pugPath, pugFile.replace(pugHook, ''))

        const scssIncludeHook = '//------ yeoman include hook ------ //'
        const scssImportHook = '//------ yeoman import hook ------ //'
        const scssIncludePath = path.join(dir, 'scss/app.scss')

        let scssIncludeFile = fs.readFileSync(scssIncludePath, 'utf-8')
        fs.writeFileSync(scssIncludePath, scssIncludeFile.replace(scssIncludeHook, ''))

        scssIncludeFile = fs.readFileSync(scssIncludePath, 'utf-8')
        fs.writeFileSync(scssIncludePath, scssIncludeFile.replace(scssImportHook, ''))
      })
      .withOptions({
        projectName: 'app'
      })
  })

  it('Create component with yeoman hooks missing', () => {
    assert.file([
      'schema/components/my-component.js',
      'scss/components/_my-component.scss',
      'js/components/_my-component.js',
      'pug/components/_my-component.pug'
    ])
    assert.noFileContent('schema/docs.js', / {2}'my-component': \[\]/)
    assert.noFileContent('pug/_mixins.pug', /include components\/_my-component.pug/)
    assert.noFileContent('scss/app.scss', / {2}@include app-my-component;/)
    assert.noFileContent('scss/app.scss', /@import 'components\/my-component';/)
  })
})

describe('generator-style-guider:component', () => {
  before((done) => {
    helpers.run(path.join(__dirname, '../generators/component'))
      .withPrompts({
        name: 'Mega Component',
        mixin: true,
        scss: true,
        js: true,
        docs: true
      })
      .inTmpDir(dir => {
        fs.copySync(path.join(__dirname, '../generators/app/templates'), path.join(dir))
        fs.copySync(path.join(__dirname, '../generators/app/templates/root/'), path.join(dir))
        fs.copySync(path.join(__dirname, '../generators/component/templates/mockPackage.json'), path.join(dir, 'package.json'))
        fs.copySync(path.join(__dirname, '../generators/component/templates/mockGulpfile.js'), path.join(dir, 'gulpfile.js'))

        const scssSearch = '<%- name %>'

        const scssIncludePath = path.join(dir, 'scss/app.scss')
        const scssIncludeFile = fs.readFileSync(scssIncludePath, 'utf-8')
        fs.writeFileSync(scssIncludePath, scssIncludeFile.split(scssSearch).join('app'))

        const scssEverythingPath = path.join(dir, 'scss/everything.scss')
        const scssEverythingFile = fs.readFileSync(scssEverythingPath, 'utf-8')
        fs.writeFileSync(scssEverythingPath, scssEverythingFile.split(scssSearch).join('app'))

        const scssExamplePath = path.join(dir, 'scss/components/_example.scss')
        const scssExampleFile = fs.readFileSync(scssExamplePath, 'utf-8')
        fs.writeFileSync(scssExamplePath, scssExampleFile.split(scssSearch).join('app'))

        const scssDocsPath = path.join(dir, 'docs/scss/docs.scss')
        const scssDocsFile = fs.readFileSync(scssDocsPath, 'utf-8')
        fs.writeFileSync(scssDocsPath, scssDocsFile.split(scssSearch).join('app'))
      })
      .withOptions({
        projectName: 'app'
      })
      .then((dir) => {
        console.log('Installing new component and then testing build/lint')
        exec('npm install', function (error, stdout, stderr) {
          if (error) {
            console.log(stderr, stdout)
            assert(false)
          }
          assert(true)
          exec('npm run lint && npm run build', function (error, stdout, stderr) {
            console.log(stdout)
            if (error) {
              console.log(stderr)
              assert(false)
            }
            assert(true)
            done()
          })
        })
      })
  })

  it('Install new component then build docs', () => {
    assert.file([
      'index.html',
      'schema/components/mega-component.js',
      'scss/components/_mega-component.scss',
      'js/components/_mega-component.js',
      'pug/components/_mega-component.pug'
    ])
  })
})
