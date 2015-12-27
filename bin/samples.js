var utils = require('../src/utils')
  promptly = require('promptly');


var sample_lables = [
    '#1. Hacker News titles',
    '#2. Hacker News titles and subtext',
    '#3. Wikipedia\'s On This Day',
    '#4. GitHub trending',
    '#5. Underscore.string functions',
    '#6. Beijing Air Twitter feed'
  ],
  sample_choices = [1,2,3,4,5,6],
  sample_cmds = [
    'http://news.ycombinator.com ".title > a" -l 6 -n',
    'http://news.ycombinator.com ".title > a, .subtext|pack|after>br" -l 10',
    'http://en.wikipedia.org/wiki/Main_Page "#mp-otd > p:first-of-type, #mp-otd > ul:first-of-type > li|tease>15"',
    'https://github.com/trending?since=weekly ".repo-list-name|pack, .repo-list-description|tease>7|after>br" --limit 20',
    'https://github.com/epeli/underscore.string "h2:contains(API) ~ h4" -n ',
//    'https://github.com/adammark/Markup.js "h3:contains(Built-in pipes) ~ p|tease>7" -n --limit 45 ',
    'https://twitter.com/BeijingAir "#stream-items-id > li div.tweet div.content p" --limit 25'
  ];

exports.action = function action(program){
    var choice,
      prompt;

    if (program.args[0]) {
      choice = program.args[0];
      if (choice > sample_choices.length || parseInt(choice, 10) != choice) {
        console.log(utils.error('Incorrect sample number.'));
      } else {
        runSample(null, choice);
        return;
      }
    }

    prompt = '\nChoose a sample to run:\n' + sample_lables.join('\n') + '\n> ';
    promptly.choose(prompt, sample_choices, runSample);
};


var runSample = exports.runSample = function runSample(err, choice, silent, callback){
  var sample_cmd = sample_cmds[ choice - 1],
    exec = require('child_process').exec,
    path = require('path'),
    cmd = 'node ./bin/' + path.basename(process.argv[1]) + ' ' + sample_cmd;

  !silent && console.log(utils.info('Running:\n' + cmd + '\n'), utils.chalk.bold.magenta(sample_lables[choice - 1]), '\n');
  exec(cmd, callback || function(err, stdout, stderr){
    err && console.log(err);
    console.log(stdout);
    console.log(stderr);
    process.exit();
  });
};
