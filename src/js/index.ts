declare var require: any;
//require('./ga.js');
require('../css/index.styl');
require('../css/font-awesome.css');

require('../../lib/highlight/styles/default.css');
let hljs = require('../../lib/highlight/highlight.pack.js');
hljs.initHighlightingOnLoad()