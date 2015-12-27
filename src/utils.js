var
  chalk = require('chalk');

exports.chalk = chalk;

exports.error = function error(text){
  return chalk.bold.red(text);
};

exports.info = function info(text){
  return chalk.bold.green(text);
};
