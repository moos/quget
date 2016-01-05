
var utils = require('../src/utils'),
  samples = require('./samples');


module.exports = function(program) {
  program
    .command('help [what]')
    .description('get extra help with: ' + utils.chalk.bold('pipes, selector, request-options'))
    .action(function (a, b) {
      var what;
      if (program.args.length < 1) program.help(); // exits
      program.done = true;

      what = program.args[0];
      switch (what) {
        case 'pipes':
          return pipes_help();
        case 'selector':
          return selector_help();
        case 'request-options':
          return request_help();

        default:
          program.help();
      }
      process.exit();
    });
};

function request_help() {
  var cmd = 'https://github.com/request/request "#user-content-requestoptions-callback  < h2 ~ ul li code:first-of-type|bold" --sep " \t"';
  samples.runCmd(cmd, '', true, function (err, stdout, stderr) {
    console.log(utils.info('Request options:'));
    console.log(stdout);
    console.log(utils.chalk.grey('For more info see'), utils.chalk.cyan('https://github.com/request/request#requestoptions-callback\n'));
  });
}

function selector_help() {
  samples.runSample(null, 6, true, function (err, stdout, stderr) {
    console.log(utils.info('Cheerio selectors:'));
    console.log(stdout);
    console.log(utils.chalk.grey('For more info see'), utils.chalk.cyan('https://github.com/fb55/css-select\n'));
  });
}

function pipes_help() {
  var styles = require('chalk').styles,
    cheerio = require('../src/pipes/cheerio.js'),
    Mark = {},
    bold = utils.chalk.bold,
    basic;

  samples.runSample(null, 5, true, function (err, stdout, stderr) {
    console.log(utils.info('Build-in Markup.js pipes:'));
    console.log(stdout);
    console.log(utils.chalk.grey('For more info see'), utils.chalk.cyan('https://github.com/adammark/Markup.js#built-in-pipes\n'));
  });

  Mark.pipes = {};
  basic = require('../src/pipes/basic.js')(Mark);

  console.log(utils.info('Basic filters:'));
  console.log(Object.keys(Mark.pipes).sort().map(function(pipe){
    return bold(pipe) + ' -- ' + Mark.pipes[ pipe ].help;
  }).join('\n'));
  console.log(bold('colorize') + ' -- ' + 'apply random chalk style to every line');
  console.log('');

  console.log(utils.info('Chalk styles:'));
  console.log(Object.keys(styles).sort().map(function(style){
    return bold(style) + ' (' + utils.chalk[ style ]('sample') + ')';
  }).join('\n'));
  console.log(utils.chalk.grey('\nFor more info see'), utils.chalk.cyan('https://github.com/chalk/chalk\n'));

  console.log(utils.info('Cheerio modifier:'));
  console.log(bold('@attr'), 'select one or more attributes, e.g.  div.a@href, p.span@id@class|red');
  console.log(bold('@html'), 'select html(), e.g.  div.a@html');
  console.log(bold('@text'), 'select text(), e.g.  div.a@text', utils.chalk.grey('(default)\n'));
}