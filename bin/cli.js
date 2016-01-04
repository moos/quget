#!/usr/bin/env node

var
  program = require('commander'),
  version = require('../package.json').version,
  quget = require('../src/quget');

program
  .version(version)
  .usage('[command] [options] <url> [selector] | -\n'
    + '\n  Example: quget http://news.ycombinator.com ".title > a|bold|red" -l 5')
  .option('-T, --template <template>', 'template "node: {{name}}, text {{.|text}}"')
  .option('--sep <seperator>', 'seperator for multiple matches', sanitize, '\n')
  .option('-l, --limit <count>', 'limit query to <count> matches (-count from bottom)', parseInt, 0)
  .option('-r, --rand', 'select randomly from matched set (can be combined with --limit)')
  .option('-n, --lineNumber', 'add line numbers to output')
  .option('-j, --json', 'full results object as JSON')
  .option('-c, --compact', 'when used with --json, outputs compact format')
  .option('- , --stdin', 'read <url> from STDIN');

// samples
require('./samples').init(program);

// help topic
require('./help')(program);

// parse
program.parse(process.argv);
if (program.done) return;
if (program.args.length < 1 && !program.stdin) return console.log(program.helpInformation());

//console.log(program);

if (program.stdin) {
  const getStdin = require('get-stdin');
  getStdin.tty = true;

  getStdin().then(urls => {
    urls.split('\n')
      .filter(url => {
        return !!url.trim();
      })
      .map(url => {
        var sep = url.indexOf(' '), // take selector from stdin if given
          sel = program.args[0];

        if (sep > 0) {
          sel = url.substr(sep + 1);
          url = url.substr(0, sep);
        }
        return function(){
          return run(url, sel, done);
        };
    })
    .reduce(function(next, fn) {
      return next = next.then(fn);
    }, Promise.resolve());

  });
} else {
  run(program.args[0], program.args[1] || '', done);
}

// run
function run(url, selector) {
  return quget.run(url, selector, program).then(done);
}

function done(result) {
  if (program.compact) {
    quget.compactJson(result);
  } else {
    console.log(result);
  }
}

function sanitize(text) {
  return text
    .replace(/\\t/g, '\t')
    .replace(/\\n/g, '\n')
}

