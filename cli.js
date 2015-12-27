#!/usr/bin/env node
var
  program = require('commander'),
  promptly = require('promptly'),
  version = '0.0.0.1',
  cmd;


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

program
  .version(version)
  .usage('[options] <url> [selector]')
  .option('-T, --template <template>', 'template')
  .option('-i, --input', 'input file, one url per line')
  .option('--sep <seperator>', 'seperator for multiple matches', '\n')
  .option('-l, --limit <count>', 'limit query to <count> matches', '0')
  .option('-n, --linenumber', 'add line numbers to output')
  .option('-t, --trim', 'trim whitespace')

// request parameters
//  .option('-m, --method <method>', 'One of get, post, put (Default: get)')
//  .option('-d, --data', 'data to pass to request as key:value,...')

  .option('-p, --pick <part>', 'pick part')
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
//require('./help')(program);

// parse
program.parse(process.argv);

//console.log(program)
//return;

if (program.args.length < 1) return console.log(program.helpInformation());
if (cmd) return;

// run
var Quget = require('./quget'),
  url = program.args[0],
  selector = program.args[1] || '',
  result;


result = Quget.run(url, selector, program);
