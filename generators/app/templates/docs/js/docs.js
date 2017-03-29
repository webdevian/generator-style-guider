var pug = require('pug')

/**
 * On page load fetch the parameters via ajax
 * and save them to window object. Set up mixins object
 */
$(document).ready(function () {
  $.get('docs/pug/_parameters.pug', function (response) {
    window.codeMixins = response
  })

  window.mixins = {}
})

/**
 * Show code blocks when a show code button is clicked
 * No JS Fallback: ✅ // Don't show code buttons if js is disabled
 */
$(document).on('click', '.show-code', function () {
  $(this).toggleClass('open')

  if ($(this).hasClass('open')) {
    openCode($(this).data('open-component'))
  }
})

/**
 * Open the code panel, fetch the component schema, render the
 * form fields, write out the mixin call and arguments, fetch the
 * mixin code, save it, then render the code and preview
 * @param  {string} component [The name of the component]
 * @return {null}           [Code block is opened]
 */
function openCode (component) {
  var $component = $('[data-component=' + component + ']')

  $component.addClass('loading')

  var schema = window.components[component]
  renderFields(schema, component, $component)
  renderBlock(schema, component, $component)

  var mixinString = getMixinString(schema, component)
  $component.find('.mixin-call').html(mixinString)

  if (schema.inline) {
    var $html = $component.find('.html')
    $component.find('.result').first().appendTo($html)
  }

  $.get(schema.mixinPath || 'pug/components/_' + component + '.pug', function (mixin) {
    window.mixins[component] = mixin

    updateMixin(component, $component)

    $component.removeClass('loading')
  })
}

/**
 * Use schema data to determine the type of field needed
 * for each parameter, fetch the field and add it to the DOM
 * @param  {object} schema component schema data
 * @param  {string} component name of the component
 * @param  {object} $component jQuery object
 * @return {null}            Fields added to DOM
 */
function renderFields (schema, component, $component) {
  // Empty existing fields (in case code block has been opened already)
  $component.find('.pug form *, .pug textarea').remove()
  if (!schema || !schema.params) {
    alert(component + ' component has no params set up')
  }
  $.each(schema.params, function (key, val) {
    var params = {
      name: key,
      title: camelToTitle(key),
      id: component + '-' + key,
      options: null,
      selected: String(val.default),
      value: val.default,
      description: val.description
    }
    var field = ''

    if (val.enum) {
      params.options = val.enum
      field = renderEnum(params)
    } else if (val.type === 'boolean') {
      params.options = ['true', 'false']
      field = renderBoolean(params)
    } else if (val.type === 'string') {
      field = renderString(params)
    } else if (val.type === 'number') {
      field = renderNumber(params)
    } else if (val.type === 'array' || val.type === 'object') {
      field = renderJSON(params)
    }

    $component.find('.pug form').append(field)
  })
}

/**
 * Convert a camel case strings to title case. ie - 'myVariableName' to 'My Variable Name'
 * @param  {string} camelCase The camelcase string to be converted
 * @return {string}        Title case string
 */
function camelToTitle (camelCase) {
  if (camelCase == null || camelCase === '') {
    return camelCase
  }

  camelCase = camelCase.trim()

  var newText = ''

  for (var i = 0; i < camelCase.length; i++) {
    if (/[A-Z]/.test(camelCase[i]) && i !== 0 && /[a-z]/.test(camelCase[i - 1])) {
      newText += ' '
    }
    if (i === 0 && /[a-z]/.test(camelCase[i])) {
      newText += camelCase[i].toUpperCase()
    } else {
      newText += camelCase[i]
    }
  }

  return newText
}

/**
 * Build a dropdown for enumerated parameters
 * @param  {object} params parameters passed to pug
 * @return {string}        html
 */
function renderEnum (params) {
  return pug.render(
    window.codeMixins + '\n' +
    '+docs_select(name, title, id, description, options, selected)',
    params
  )
}

/**
 * Build a radio group for boolean parameters
 * @param  {object} params parameters passed to pug
 * @return {string}        html
 */
function renderBoolean (params) {
  return pug.render(
    window.codeMixins + '\n' +
    '+docs_radio(name, title, id, description, options, selected)',
    params
  )
}

/**
 * Build a text input for string parameters
 * @param  {object} params parameters passed to pug
 * @return {string}        html
 */
function renderString (params) {
  return pug.render(
    window.codeMixins + '\n' +
    '+docs_text(name, title, id, description, value)',
    params
  )
}

/**
 * Build a number input for number parameters
 * @param  {object} params parameters passed to pug
 * @return {string}        html
 */
function renderNumber (params) {
  return pug.render(
    window.codeMixins + '\n' +
    '+docs_number(name, title, id, description, value, null, null, 1)',
    params
  )
}

/**
 * Build a textarea for json parameters
 * @param  {object} params parameters passed to pug
 * @return {string}        html
 */
function renderJSON (params) {
  return pug.render(
    window.codeMixins + '\n' +
    '+docs_json(name, title, id, description)' + '\n' +
    '  |' + JSON.stringify(params.value),
    params
  )
}

/**
 * Render a tetarea for the mixin block string
 * @param  {object} schema component schema data
 * @param  {string} component name of the component
 * @param  {object} $component jQuery object
 * @return {null}            Textarea added to DOM
 */
function renderBlock (schema, component, $component) {
  if (schema.block) {
    var block = pug.render(
      'textarea(id=id, name="blockField")= text',
      {
        id: component + '-block',
        text: schema.block !== true ? schema.block : null
      }
    )
    $($component).find('.pug .blockField').append(block)
  } else {
    $($component).find('.pug .blockField').remove()
  }
}

/**
 * Use the params from the schema to build a string
 * for the mixin documentation
 * @param  {object} schema component schema data
 * @param  {string} component name of the component
 * @return {string}           Mixin string
 */
function getMixinString (schema, component) {
  var str = component + '('

  $.each(schema.params, function (key, val) {
    str += key + ', '
  })

  str = str.slice(0, -2) + ')'

  return str
}

/**
 * When form values are changed, fire updateMixin to update the previews
 */
$(document).on('change', '[data-component] .pug :input', function () {
  var $component = $(this).closest('[data-component]')
  var component = $component.data('component')

  updateMixin(component, $component)
})

/**
 * Update the mixin call, html output and live preview
 * @param  {string} component name of the component
 * @param  {object} $component jQuery object
 * @return {null}            Examples are updated
 */
function updateMixin (component, $component) {
  // Write mixin Call
  var mixinCall = writeMixinCall(component, $component)
  $component.find('code.mixin').text(mixinCall)

  // Write Output
  var output = renderMixin(component, mixinCall)
  output = output.replace(/\n/, '')
  $component.find('code.output').text(output)

  // Write preview
  $component.find('.result .stage').html(output)

  $component.find('code').each(function (i, block) {
    hljs.highlightBlock(block)
  })
}

/**
 * Take values from the form and build them up into
 * a pug mixin call string
 * @param  {string} component name of the component
 * @param  {object} $component jQuery object
 * @return {string}            pug string
 */
function writeMixinCall (component, $component) {
  var fields = $component.find('form').serializeArray()
  var block = $component.find('[name=blockField]').val()

  var str = '+' + component + '('

  $.each(fields, function (index, field) {
    // If it's boolean or json object/array don't wrap quotes around it
    if (field.value === 'true' || field.value === 'false' || field.value.match(/^\{|\[/)) {
      str = str += field.value + ', '
    } else if (field.value === '' || typeof (field.value) === 'undefined') {
      str = str += 'null, '
    } else {
      str = str += '\'' + field.value + '\', '
    }
  })

  str = str.slice(0, -2) + ')'

  if (block) {
    // If the block contains tabs we shouldn't escape
    // it, because it might contain another mixin
    if (block.includes('  ')) {
      str += '\n  '
      block = block.replace(/\n[^\s\\]/g, '\n  ')
    } else {
      str += '.\n  '
      block = block.replace(/\n/g, '\n  ')
    }
    str += block
  }

  return str
}

/**
 * Convert the pug code to html
 * @param  {string} component name of the component
 * @param  {string} mixinCall pug string
 * @return {string}           html string
 */
function renderMixin (component, mixinCall) {
  return pug.render(
    window.mixins[component] + '\n' + mixinCall,
    { pretty: '  ' }
  )
}
