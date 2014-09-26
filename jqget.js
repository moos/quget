#!/usr/bin/env node
var
  program = require('commander'),
  chalk = require('chalk'),
  version = '0.0.0.1';

var xGoods = 'text,html,val,attr:<name>,css:<name>,data:<name>',
  xtract = [];

program
  .version(version)
  .usage('[options] <url> [selector]')
//  .option('--html', 'output HTML (default) (aliad of -x html)')
  .option('--text', 'output text instead of html (alias of -x text)')

  .option('-x, --extract <part>', 'extraction command, <part> is comma separated list of: ' +  xGoods,
    function(what){
      var
        sep = ',',
        goods = sep + (xGoods).replace(/<name>/g,'') + sep,
        params = what.split(sep),
        p;

      params.forEach(function(w){

        p = w.replace(/:.*/,':');

        console.log( w, p, goods)

        if (goods.indexOf(sep + p + sep) === -1 &&
          goods.indexOf(sep + p.replace(':','')) === -1) {

          console.error(error('Bad argument: ' + w));
          program.help(); // exits
        }

        xtract.push(w)
      });

      return params;
  })

//  .option('-t, --traverse <where>', 'traverse command, <where> is ...')

  .option('--sep <seperator>', 'seperator for multiple matches', '\n')
  .option('-l, --limit <count>', 'limit query to <count> matches', '0')
  .option('-n, --linenumber [index]', 'add line numbers to output starting at <index>', '1')

// request parameters
//  .option('-m, --method <method>', 'One of get, post, put (Default: get)')
//  .option('-d, --data', 'data to pass to request as key:value,...')

  .option('-j, --json', 'full results object as JSON')
  .parse(process.argv);

if (program.linenumber === true) program.linenumber = 1;


if (program.args.length < 1) return console.log(program.helpInformation());

//console.log(program) && return;

var
  request = require('request'),
  url = program.args[0],
  selector = program.args[1] || '';

if (!xtract.length){
  xtract = program.text ? ['text'] : ['html']

//  xtract = program.extract;//.split(',');
  console.log(xtract)
}

request(url, function (err, response, html) {
  if (err) {
    error(err);
    return;
  }
  var output = '';

  if (selector) {
    var cheerio = require('cheerio'),
      $ = cheerio.load(html),
      result = $(selector);

    // NOTE: text() returns for all matched elements, but html() for first one only!
    if (result.length === 1) {
      output = program.text ? result.text() : $.html(result);
    } else {
      var coll = [],
        str;
      result.each(function(i){

        str = extract($, this);
        if (program.linenumber) {
          str = (+program.linenumber + i) + ' ' + str;
        }
        coll.push(str);
        if (program.limit > 0 && ++i >= program.limit) return false;
      });

      output = coll.join(program.sep);
    }
  } else {
    output = html;
  }

  console.log(output);

});

function extract($, result) {
  var obj = {},
    $result = $(result),
    value, name;

  xtract.forEach(function(what, i){

    if (what.indexOf(':') > -1) { // eg, attr:width
      what = what.split(':');
      name = what[1]; // width
      what = what[0]; // attr
    }

    if (what === 'html') {
      value = $.html(result);
    } else {
      value = name ? $result[ what ](name) : $result[ what ]();
    }

    obj[ xtract[i] ] = value;
  });

//  console.log(obj)
  return JSON.stringify(obj);
}

function error(text){
  console.error(chalk.bold.red(text));
}