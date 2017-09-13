'use strict'
const path = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')
const fs = require('fs-extra')
const exec = require('child_process').exec

describe('generator-style-guider:app - npm', () => {
  before(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        name: 'my-styles',
        depManager: 'npm',
        husky: true
      })
  })

  it('creates files', () => {
    assert.file([
      'package.json',
      'scss/my-styles.scss'
    ])
  })
})

describe('generator-style-guider:app - yarn', () => {
  before(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        name: 'My Styles',
        depManager: 'yarn',
        husky: true
      })
  })

  it('creates files', () => {
    assert.file([
      'package.json',
      'scss/my-styles.scss'
    ])
  })
})

describe('generator-style-guider:app - npm w/ install', () => {
  before((done) => {
    helpers.run(path.join(__dirname, '../generators/app'))
      .inTmpDir(dir => {
        fs.writeFileSync(path.join(dir, '.npmrc'), 'loglevel=warn\nprogress=false')
      })
      .withPrompts({
        name: 'my-styles',
        depManager: 'npm',
        husky: false
      })
      .withOptions({ skipInstall: false })
      .then((dir) => {
        return exec('npm run lint', {}, function (error, stdout, stderr) {
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

  it('Install dependencies then build docs', () => {
    assert.file([
      'index.html',
      'dist/my-styles.min.css',
      'dist/my-styles.min.js',
      'docs/css/docs.css',
      'docs/js/scripts.js'
    ])
  })
})

describe('generator-style-guider:app - yarn w/ install', () => {
  before(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        name: 'My Styles',
        depManager: 'yarn',
        husky: true
      })
      .withOptions({ skipInstall: false })
  })

  it('Install dependencies then build docs', () => {
    assert.file([
      'index.html',
      'dist/my-styles.min.css',
      'dist/my-styles.min.js',
      'docs/css/docs.css',
      'docs/js/scripts.js'
    ])
  })
})
