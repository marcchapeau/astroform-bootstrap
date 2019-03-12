Package.describe({
  name: 'chap:astroform-bootstrap',
  version: '0.0.1',
  summary: 'Bootstrap templating for chap:astroform',
  documentation: 'README.md'
})

Package.onUse(function (api) {
  api.versionsFrom('1.8.0.2')
  api.use([
    'ecmascript',
    'ejson',
    'modules',
    'random',
    'reactive-var',
    'tracker',
    'templating@1.3.2',
    'chap:astroform@0.0.1',
    'jagi:astronomy@2.7.1',
    'ostrio:files@1.9.11'
  ], 'client')
  api.mainModule('index.js', 'client')
})
