#!/usr/bin/env node
var
  program = require('commander'),
  promptly = require('promptly'),
  chalk = require('chalk'),
  _ = require('underscore'),
  version = '0.0.0.1',
  CSSwhat = require('CSSwhat'),
  columnify = require('columnify');


//Mark.delimiter = ':';
Mark.includes.incl = function(str){
  console.log('incl', str)
  return 'html incl: ' + $(res[0]).html();
};

Mark.pipes.quote = function (str, q) {
  q = q || '"';
  return q + str + q;
};



//res[0].$ = $(res[0]);
//_.extend(res[0], $(res[0]));

function prepResult() {
  var res = this;
  var $res = $(res);
//  console.log(1111, res, Object.keys($res).join(), $res.text(), typeof $res);

  // map getters
  // TODO 'index' is undefined!
  'text css eq first last is val data'.split(' ').forEach(function (key) {
    res[key] = $res[key].bind($res)
    return;

  });
  res.attr = res.attribs; // alias
  // return outer html
  res.html = function () {
    return $.html($res)
  };
  // return outer html
  res.innerHTML = function () {
    return $res.html()
  };

  // add selector res.$<i> matches parse selector i
  parsedSelectors.forEach(function(sel, i) {
    res[ '$' + (++i) ] = function () {
      return sel === res.selector ? res : 'NO SELETOR MATCH';
    };
  });
}


//var context = {
//  num: 1.23
//};
//var template = "{{num|call>toPrecision>5}}";
//var result = Mark.up(template, context);
//console.log(result)
// "1.2300"
//return;

//function Dog() {
//  var greeting = "Woof!";
//  this.bark = function (times) {console.log(this) ; return greeting + ' x ' };
//}
//
//
//var context = {
//  howl: function(arg){ return 'owooooo!' + (arg||'') }
//};
//
//var result = Mark.up("Dog doesn't say {{howl|upcase}} ", context);
//console.log(result)
//var result = Mark.up("Dog doesn't say {{.|call>howl>!!!!!|upcase}} ", context);
//console.log(result)
//return;
//
//
//var context = {
//  doggy: new Dog(),
//  howl: function(){console.log(this) ; return 'ooooow' }
//};
//
////console.log(context.doggy.bark())
//var template = "Dog says {{doggy.bark}} not {{howl}}";
//
//var result = Mark.up(template, context);
//// "Woof! Woof! Woof!"
//console.log(result);
//
//return;
//
//var context = {
//  str: 'hello',
//  fn: function(){ return 'Result of fn' }
//}
//out = Mark.up('string is {{str|upcase}}, function is {{fn|upcase|downcase}}', context)
//console.log(out)
//return


//a = Mark.up('tag: {{type|upcase}} {{name}},\nhtml: {{.|html}} \ntext: {{.|text}}\n {{text}}', res[0]);

function printOut() {

  var res = this;

//  console.log(selectors.indexOf(res.selector));

//  var data = {Abs$1 : true };

  // .*+?^${}()|\[\]\/\\
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
//  a = Mark.up("{{$}} jQuery was here {{/$}}", data);

  a = Mark.up(
      '\ntag: {{type|upcase}} {{name}}' +
//    '\nhtml: {.|html} \ntext: {.|text}\n {{attr.a}} ' +
      '\nhtml upcase {{html|upcase|quote}} ' +
      '\ninnerHTML downcase {{innerHTML|downcase|quote}} ' +
      '\ntext {{text|quote}}' +
      '\nselector {{selector|quote}}' +

        // TODO sel index is last one, do this...
        // {{$1}} ... {{/$1}}  matched by selector 1, etc.
       '\n$1 === {{$1}} {{html}} {{/$1}}' +
       '\n$2 === {{$2}} {{html}} {{/$2}}' +
       '\n$3 === {{$3}} {{html}} {{/$3}}' +
      '\naa={{attr.aa}} class={{attr.class}} data={{data}} '
    , res);
  console.log(a);
}

res.each(prepResult);
console.log(2222, Object.keys(res[0]).join() );

res.each(printOut);


0 && res.each(function(i, a){
  console.log('result ---- ', $.html(a), 'matched by', a.selector)
});


return;



var xGoods = 'text, html, val, attr:<name>, css:<name>, data:<name>',
  xtract = [];

program
  .version(version)
  .usage('[options] <url> [selector]')
//  .option('--html', 'output HTML (default) (aliad of -x html)')
  .option('--text', 'output text instead of html (alias of -p text)')
  .option('--str <fn>', 'apply Underscore.string function, eg, trim, clean, ...')
  .option('-T, --template <template>', 'template')
  .option('-i, --input', 'input file, one url per line')
  .option('-p, --pick <part>', 'extract <part> from result (can be used multiple times) : ' +  xGoods,
    function(what){
      var
        sep = ',',
        goods = sep + (xGoods).replace(/\s+|<name>/g,'') + sep;

//      console.log(what, goods, what.replace(/([^:]*).*/,'$1:'));

      if (goods.indexOf(sep + what + sep) === -1 &&
        goods.indexOf(sep + what.replace(/([^:]*).*/,'$1:') + sep) === -1)
      {
        console.error(error('Bad argument: ' + what));
        program.help(); // exits
      }

      xtract.push(what);
      return what;
  })

//  .option('-t, --traverse <where>', 'traverse command, <where> is ...')

  .option('--sep <seperator>', 'seperator for multiple matches', '\n')
  .option('-l, --limit <count>', 'limit query to <count> matches', '0')
  .option('-n, --linenumber [index]', 'add line numbers to output starting at <index>, (-1 to deactivate)', '1')

// request parameters
//  .option('-m, --method <method>', 'One of get, post, put (Default: get)')
//  .option('-d, --data', 'data to pass to request as key:value,...')

  .option('-j, --json', 'full results object as JSON');

var sample_lables = [
    '1. Hacker News titles',
    '2. Hacker News titles and subtext',
    '3. Wikipedia\'s On This Day',
    '4. GitHub trending',
    '5. Underscore.string functions',
    '6. Beijing Air Twitter feed',
    ''
  ],
  sample_choices = [1,2,3,4,5,6],
  sample_cmds = [
    'http://news.ycombinator.com ".title a" -l 5 -p text',
    'http://news.ycombinator.com ".title a, .subtext" -l 10 -p text',
    'http://en.wikipedia.org/wiki/Main_Page "#mp-otd li, #mp-otd div small:contains(\'It is now\')" -p text',
    'https://github.com/trending?since=weekly ".repo-list-name, .repo-list-description" --limit 3 -p text',
    'https://github.com/epeli/underscore.string "h2:contains(String Functions) ~ p strong" -p text',
    'https://twitter.com/BeijingAir ".ProfileTweet-contents p" -p text'
  ],
  cmd;

program
  .command('samples [N]')
  .description('show samples, or run sample N')
  .action(function(){
    var choice,
      prompt;
    cmd = 1;

    if (program.args[0]) {
      choice = program.args[0];
      if (choice > sample_choices.length || parseInt(choice, 10) != choice) {
        console.log(error('Incorrect sample number.'));
      } else {
        runSample(null, choice);
        return;
      }
    }

    prompt = '\nChoose a sample to run:\n' + sample_lables.join('\n') + '\n> ';
    promptly.choose(prompt, sample_choices, runSample);
  });

function runSample(err, choice, silent, callback){
  var sample_cmd = sample_cmds[ choice - 1],
    exec = require('child_process').exec,
    path = require('path');

  cmd = 'node ' + path.basename(process.argv[1]) + ' ' + sample_cmd;

  !silent && console.log(info('Running:\n' + cmd + '\n'));
  exec(cmd, callback || function(err, stdout, stderr){
    err && console.log(err);
    console.log(stdout);
    console.log(stderr);
    process.exit();
  });
};

program
  .command('help [what]')
  .description('get extra help with "what"')
  .action(function(a,b){
    var what;
    if (program.args.length < 1) program.help(); // exits

    what = program.args[0];

    if (what === 'str') {

      console.log('--str <fn> - apply Underscore.string function, eg, trim, clean, ...');
      console.log('<fn> can be one of:\n');
      runSample(null, 5, true, function(err, stdout, stderr){
        console.log(stdout);
        console.log('\nFor more info see https://github.com/epeli/underscore.string');
      });
      return;

//      var _s = require('underscore.string'),
//        msg = '';
//
//      msg = '--string <fn> - apply Underscore.string function, eg, trim, clean, ...'
//        + '\n <fn> is one of:\n'
//        +  Object.keys(_s).join(', ')
//        + '.\nFor more info see https://github.com/epeli/underscore.string'
//
//      console.log(msg)
    } else {
      program.help();
    }

    process.exit();
  });


program.parse(process.argv);

//console.log(program)
//return;

if (program.args.length < 1) return console.log(program.helpInformation());
if (cmd) return;

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
    console.log(error(err));
    return;
  }

  if (!selector) {
    console.log(html);
    return;
  }

  var cheerio = require('cheerio'),
    opt = {selectors: []},
    Mark = require("markup-js"),
    $ = cheerio.load(html, opt),
    fs = require('fs'),
    results = $(selector),
    coll = [],
    str;

  initMark(Mark);

  console.log(results[0]);

  str = Mark.up(program.template || '<no template give>', results[0]);
  console.log('-----\n', str);
  return;



  // NOTE: text() returns for all matched elements, but html() for first one only!
  results.each(function(i){

//    console.log(1111, this.selector);

    str = extract($, this);
    if (program.linenumber) {
//        str = (+program.linenumber + i) + ' ' + str;
    }
    coll.push(str);
    if (program.limit > 0 && ++i >= program.limit) return false;
  });
//  output = coll.join(program.sep);
  output(coll);
});

function initMark(Mark) {
//  console.log(Mark.pipes);

  Mark.delimiter = ':';

  Mark.includes.html = function(str){

  };

  Mark.pipes.html = function(str){
    return 'html -- ' + str;
  };
}


function output(coll){
  coll.forEach(function(item){
    console.log(item)
    Object.keys(item).forEach(function(key){
//      console.log(item[key])
    })
  })
}

function extract($, result) {
  var obj = {},
    $result = $(result),
    _s = require('underscore.string'),
    value, name;

//  console.log($result.html(), result.selector)

  xtract.forEach(function(what, i){

//    console.log(what, i);

    if (what.indexOf(':') > -1) { // eg, attr:width
      what = what.split(':');
      name = what[1]; // width
      what = what[0]; // attr
    }

    if (what === 'html') {
      value = $.html(result);
    } else {
      value = name ? $result[ what ](name) : $result[ what ]();
//      program.trim && (value = value.trim());
      if (program.str && program.str in _s) {
        value = _s[ program.str ](value);
      }
    }

    obj[ xtract[i] ] = value;
  });

//  console.log(obj)
//  return JSON.stringify(obj);
  return obj;
}

function error(text){
  return chalk.bold.red(text);
}

function info(text){
  return chalk.bold.green(text);
}