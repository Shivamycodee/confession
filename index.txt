// @shivamycodee/confession/index.js
const pkgJson = require('./package.json');

if (pkgJson.type === 'module') {
  // ES6 module environment
  module.exports = require('./es6m/index.js');
} else {
  // CommonJS environment
  module.exports = require('./commonjs/index.js');
}

// Fallback for environments that don't support conditional exports
module.exports.default = require('./commonjs/index.js');
