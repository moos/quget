#!/usr/bin/env node

var
  program = require('commander'),
  version = require('../package.json').version,
  cmd;


program
  .version(version)
  .usage('[options] <url> [selector]')
  .option('-T, --template <template>', 'template')
  .option('-i, --input', 'input file, one url per line')
  .option('--sep <seperator>', 'seperator for multiple matches', '\n')
  .option('-l, --limit <count>', 'limit query to <count> matches', '0')
  .option('-n, --lineNumber', 'add line numbers to output')

// request parameters
//  .option('-m, --method <method>', 'One of get, post, put (Default: get)')
//  .option('-d, --data', 'data to pass to request as key:value,...')
  .option('-j, --json', 'full results object as JSON');

// samples
program
  .command('samples [N]')
  .description('show samples, or run sample N')
  .action(function(){
    var samples = require('./samples');
    cmd = 1;

    samples.action(program);
  });

// help topic
require('./help')(program);

// parse
program.parse(process.argv);


if (program.args.length < 1) return console.log(program.helpInformation());
if (cmd) return;

// run
var quget = require('../src/quget'),
  url = program.args[0],
  selector = program.args[1] || '',
  result;

quget.run(url, selector, program);
