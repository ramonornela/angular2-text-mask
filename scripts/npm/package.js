var fs = require('fs');
var process = require('process');
var path = require('path');
var process = require('process');

var originalPath = path.join(process.cwd(), 'package.json');
var tempPath = path.join(process.cwd(), 'package_tmp.json');

var Package = {

  prepare: function() {
	  
    var packageJson = require(originalPath);
    var packageJsonDist = require('./package.json');

    if (! packageJson) {
      throw new Error('Can\'t find package json');
    }

    delete packageJson.devDependencies;

    for (var key in packageJsonDist) {
      packageJson[key] = packageJsonDist[key];  
    }

    fs.renameSync(originalPath, tempPath);
    fs.writeFileSync(originalPath, JSON.stringify(packageJson, null, 2));	
  },

  restore: function() {
    fs.renameSync(tempPath, originalPath);
  }
}

var argvJson = JSON.parse(process.env.npm_config_argv);

if (argvJson.original && argvJson.original.length > 2) {
  var method = argvJson.original[2].replace(/-/g, '');
  Package[method]();
  return;
}

throw 'Should be argument assign argv prepare or restore';
