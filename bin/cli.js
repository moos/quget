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
  .option('-l, --limit <count>', 'limit query to count matches (-count from bottom)', parseInt, 0)
  .option('-r, --rand', 'select randomly from matched set (can be combined with --limit)')
  .option('-j, --json', 'full results object as JSON')
  .option('-c, --compact', 'when used with --json, outputs compact format')
  .option('-n, --line-number', 'add line numbers to output')
  .option('- , --stdin', 'read <url>(s) from STDIN')
  .option('--sep <seperator>', 'seperator for multiple matches', sanitize, '\n')
  .option('--request-options <request-options>', 'options for "request" as relaxed JSON, "{foo: bar}"')
;

// samples
require('./samples').init(program);

// help topic
require('./help')(program);

// parse
program.parse(process.argv);
if (program.done) return;
if (program.args.length < 1 && !program.stdin) return console.log(program.helpInformation());

//console.log(program.args);

if (program.stdin) {
  const getStdin = require('get-stdin-with-tty');
  getStdin.tty = true;
  let collector = [];

  getStdin().then(function(urls) {
    urls.split(/\r?\n/)
      .filter(function(url) {
        return !!url.trim();
      })
      .map(function(url) {
        var sep = url.indexOf(' '), // take selector from stdin if given
          sel = program.args[0];

        if (sep > 0) {
          sel = url.substr(sep + 1).trim() || sel;
          url = url.substr(0, sep);
        }
        return function(){
          return quget
            .run(url, sel, program)
            .then(function(res){
              collector.push(res);
            })
            .catch(function(err) {
              done(collector.join(program.sep));  // output what we have so far
              console.error('\nError - aborting.', err);
              process.exit(-1);
            });
        };
    })
    .reduce(function(next, fn) {
      return next = next.then(fn);
    }, Promise.resolve())
    .then(function() {
      done(collector.join(program.sep));
    });
  });
} else {
  run(program.args[0], program.args[1] || '');
}

// run
function run(url, selector) {
  return quget
    .run(url, selector, program)
    .then(done)
    .catch(function(){
      process.exit(-1);
    });
}

function done(result) {
  if (program.compact) {
    quget.compactJson(result);
  } else {
    console.log(result);
  }
 process.exit(0);
}

function sanitize(text) {
  return text
    .replace(/\\t/g, '\t')
    .replace(/\\n/g, '\n')
}
