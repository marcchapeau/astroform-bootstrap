Package.describe({
  name: 'chap:astroform-bootstrap',
  version: '0.0.4',
  summary: 'Bootstrap templating for chap:astroform',
  documentation: 'README.md'
})

Package.onUse(function (api) {
  api.versionsFrom('1.8.1')
  api.use([
    'ecmascript',
    'ejson',
    'modules',
    'random',
    'reactive-var',
    'tracker',
    'templating@1.3.2',
    'chap:astroform@0.0.1',
    'jagi:astronomy@2.7.2',
    'mvinc:markdown@0.0.4',
    'ostrio:files@1.11.1'
  ], 'client')
  api.mainModule('index.js', 'client')
})
