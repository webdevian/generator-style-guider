'use strict'
var path = require('path')
var assert = require('yeoman-assert')
var helpers = require('yeoman-test')

describe('generator-style-guider:app', () => {
  before(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({name: 'my-styles', depManager: 'npm'})
  })

  it('creates files', () => {
    assert.file([
      'package.json',
      'scss/my-styles.scss'
    ])
  })
})

describe('generator-style-guider:app', () => {
  before(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({name: 'My Styles', depManager: 'yarn', husky: true})
  })

  it('creates files', () => {
    assert.file([
      'package.json',
      'scss/my-styles.scss'
    ])
  })
})
