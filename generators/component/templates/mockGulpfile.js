/* eslint import/extensions: 0 */

var fs = require('fs')
var gulp = require('gulp')
var gutil = require('gulp-util')
var $ = require('gulp-load-plugins')()
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')
var gulpPug = require('gulp-pug')
var pug = require('pug')
var pugLinter = require('gulp-pug-linter')
var standard = require('gulp-standard')
var server = require('gulp-webserver')
var sassError = require('gulp-sass-error').gulpSassError
var exec = require('child_process').exec

/**
 * Execute sass-lint, error on build, warn on watch
 */
gulp.task('sass-lint', function (cb) {
  exec('./node_modules/.bin/sass-lint -v', function (err, stdout) {
    if (err) { gutil.log(err) }
    if (stdout) { gutil.log(stdout) }
    cb(0)
  })
})

/**
 * Run es-lint against js files, error on build, warn on watch
 */
gulp.task('js-lint', function () {
  return gulp.src([ 'js/**/*.js', 'schema/**/*.js', 'gulpfile.js', '!js/vendor/**' ])
  .pipe(standard())
  .pipe(standard.reporter('default', {
    breakOnError: false,
    quiet: true
  }))
})

/**
 * Run pug-lint against pug files, error on build, warn on watch
 */
gulp.task('pug-lint', function () {
  return gulp.src([ '**/*.pug' ])
    .pipe(pugLinter())
    .pipe(pugLinter.reporter(null))
})

/**
 * Generate css for docs/style-guide in docs/css/docs.css
 */
gulp.task('sass', function () {
  return gulp.src('docs/scss/docs.scss')
    .pipe(
    $.sass({
      includePaths: [
        // Include Foundation Sass
        'node_modules/foundation-sites/scss'
      ],
      outputStyle: 'expanded'
    })

    // Throw error, if not using the default (watch) task
    .on('error', sassError(process.argv.length > 2))
  )
    .pipe(
    $.autoprefixer({
      browsers: [ 'last 2 versions', 'ie >= 9' ]
    })
  )
    .pipe(gulp.dest('docs/css'))
})

/**
 * Generate css for everything in dist/app.min.css
 */
gulp.task('dist-css', function () {
  return gulp.src('scss/everything.scss')
  .pipe(
    $.sass({
      includePaths: [
        // Include Foundation Sass
        'node_modules/foundation-sites/scss'
      ],
      outputStyle: 'compressed'
    })
    .on('error', sassError(process.argv.length > 2))
  )
    .pipe(
    $.autoprefixer({
      browsers: [ 'last 2 versions', 'ie >= 9' ]
    })
  )
  .pipe(rename('app.min.css'))
  .pipe(gulp.dest('dist'))
})

/**
 * Generate js for everything in docs/js/scripts.js
 */
gulp.task('js', function () {
  return gulp.src('js/components/**/*.js')
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest('docs/js'))
})

/**
 * Generate js for everything in dist/app.min.js
 */
gulp.task('dist-js', function () {
  return gulp.src('js/components/**/*.js')
  .pipe(concat('app.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('dist'))
})

/**
 * Render docs pug file to index.html
 */
gulp.task('pug', function () {
  var data = require('./schema/docs')

  if (data.introduction) {
    data.introduction.forEach(function (p, i) {
      data.introduction[i] = pug.render('| ' + p)
    })
  }

  data.components = {}

  if (data.menu) {
    Object.keys(data.menu).forEach(function (k, i) {
      if (data.components[k]) {
        console.log('Duplicate component: ' + k)
      }
      data.components[k] = extractComponent(k)

      if (data.menu[k].length) {
        data.menu[k].forEach(function (c, i) {
          if (data.components[c]) {
            console.log('Duplicate component: ' + c)
          }
          data.components[c] = extractComponent(c)
        })
      }
    })

    data.menuLinks = buildMenu(data.menu, data.components)
  }

  var pkg = JSON.parse(fs.readFileSync('./package.json'))
  data.version = pkg.version

  return gulp.src('docs/pug/docs.pug')
  .pipe(gulpPug({ data: data, pretty: true }))
  .on('error', onError)
  .pipe(rename('index.html'))
  .pipe(gulp.dest('.'))
})

/**
 * Convert user submitted menu object to array for
 * top-menu mixin
 * @param  {Object} menu data.menu object
 * @param  {Object} components data.components object (For names)
 * @return {Array}
 */
function buildMenu (menu, components) {
  var array = []

  Object.keys(menu).forEach(function (k, i) {
    var parent = {
      label: components[k].title
    }

    if (menu[k].length) {
      parent.children = []

      menu[k].forEach(function (c, i) {
        parent.children.push({
          label: components[c].title,
          link: '#' + c
        })
      })
    } else {
      parent.link = '#' + k
    }

    array.push(parent)
  })

  return array
}

/**
 * Use the params from the schema to build a string
 * for the mixin documentation
 * @param  {object} schema component schema data
 * @param  {string} component name of the component
 * @return {string}           Mixin string
 */
function getMixinString (schema, component) {
  var str = '+' + component + '('

  Object.keys(schema.params).forEach(function (key) {
    str += JSON.stringify(schema.params[key].default) + ', '
  })

  str = str.slice(0, -2) + ')'

  return str
}

/**
 * Fetch component module from file then render and necessary pug strings
 * @param  {string} component Name of component
 * @return {object}           Component schema object
 */
function extractComponent (component) {
  var schema
  try {
    schema = require('./schema/components/' + component)
  } catch (e) {
    console.log(component + ' - ' + e.code)
    schema = {
      name: component,
      title: component
    }
  }

  if (schema.docs) {
    schema.docs.forEach(function (d, j) {
      schema.docs[j] = pug.render('| ' + d)
    })
  }

  var mixin = ''

  if (schema.params || schema.mixinPath) {
    try {
      mixin = fs.readFileSync(schema.mixinPath || './pug/components/_' + component + '.pug') + '\n'
    } catch (e) {
      console.log(e)
    }
  }

  if (schema.demo) {
    schema.demoCall = schema.demo
    schema.demo = pug.render(mixin + schema.demo)
  } else if (mixin) {
    schema.demoCall = getMixinString(schema, component)
    if (schema.block && typeof schema.block === 'string') {
      if (schema.block.includes('  ')) {
        schema.demoCall += '\n  '
      } else {
        schema.demoCall += '.\n  '
      }

      schema.demoCall += schema.block.replace(/\n/g, '\n  ')
    }
    schema.demo = pug.render(mixin + schema.demoCall)
  }

  return schema
}

gulp.task('dist', [ 'dist-css', 'dist-js' ])

gulp.task('build', [ 'sass', 'js', 'pug', 'dist' ])

gulp.task('lint', [ 'sass-lint', 'pug-lint', 'js-lint' ])

gulp.task('default', [ 'lint', 'sass', 'pug' ], function () {
  gulp.watch('scss/**/*.scss', [ 'sass-lint', 'sass' ])
  gulp.watch('pug/**/*.pug', [ 'pug-lint', 'pug' ])
  gulp.watch('schema/**/*.js', [ 'js-lint', 'pug' ])
  gulp.watch('js/**/*.js', [ 'js-lint', 'js' ])
  gulp.src('')
  .pipe(server({
    port: 8888,
    livereload: true,
    open: true
  }))
})

/**
 * Catch errors
 * @param  {object} err The error
 * @return {null}     Print error to console
 */
function onError (err) {
  console.log(err.message || err.msg || err.code)
  if (err.filename) console.log(err.filename + ':' + err.line + ':' + err.column)
  this.emit('end')
}
