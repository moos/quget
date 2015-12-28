#!/usr/bin/env node

var
  program = require('commander'),
  version = require('../package.json').version,
  cmd;

program
  .version(version)
  .usage('[command] [options] <url> [selector]\n'
    + '\n  Example: quget http://news.ycombinator.com ".title > a|bold|red" -l 5')
  .option('-T, --template <template>', 'template')
  .option('--sep <seperator>', 'seperator for multiple matches', '\n')
  .option('-l, --limit <count>', 'limit query to <count> matches', '0')
  .option('-n, --lineNumber', 'add line numbers to output')
  .option('-j, --json', 'full results object as JSON')
  .option('-c, --compact', 'when used with --json, outputs compact format');


// samples
require('./samples').init(program);

// help topic
require('./help')(program);

// parse
program.parse(process.argv);

if (program.args.length < 1) return console.log(program.helpInformation());
if (program.done) return;

// run
var quget = require('../src/quget'),
  url = program.args[0],
  selector = program.args[1] || '',
  result;

quget.run(url, selector, program);
