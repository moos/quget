var utils = require('../src/utils'),
  _ = require('underscore'),
  promptly = require('promptly');


exports.init = function(program) {
  program
    .command('samples [N]') // additional args are passed to quget
    .description('show samples, or run sample N')
    .action(function () {
      program.done = true;
      action(program);
    });
};

var samples = [{
    label: 'Hacker News titles',
    cmd  : 'http://news.ycombinator.com ".title > a" -l 7 -n'
  }, {
    label: 'Hacker News titles and subtext',
    cmd: 'http://news.ycombinator.com ".title > a, .subtext|pack|after \\n|red" -l 7'
  }, {
    label: 'Wikipedia\'s On This Day',
    cmd: 'http://en.wikipedia.org/wiki/Main_Page "#mp-otd > p:first-of-type, #mp-otd > ul:first-of-type > li|tease 15"'
  }, {
    label: 'GitHub trending',
    cmd: 'https://github.com/trending?since=weekly ".repo-list-name|pack, .repo-list-description|tease 7|after \\n" --limit 10'
  }, {
    label: 'Markup filters',
    cmd: 'https://github.com/adammark/Markup.js "h3:contains(Built-in pipes) ~ p|tease 9" -n --limit 45 '
  }, {
    label: 'Cheerio selectors',
    cmd: 'https://github.com/fb55/css-select "h2:contains(Supported selectors) ~ ul li|pack|before \\n\\t "'
  }, {
    label: 'Beijing Air Twitter feed',
    cmd: 'https://twitter.com/BeijingAir "#stream-items-id > li div.tweet div.content p" --limit 25'
  }, {
    label: 'Custom template 1',
    cmd: 'https://twitter.com/BeijingAir "#stream-items-id > li div.tweet div.content p" --limit 25 -T "{{parent.children.1|text|red}}"'
  }, {
    label: 'Custom template 2',
    cmd: 'http://news.ycombinator.com ".title > a, .subtext" -l 4 -T "{{if $0}}{{.|choose Title|red}}: {{.|text}}{{/if}} - {{if $1}}{{if $1}}{{.|text|pack|red|after \\n}}{{/if}}"'
  }, {
    label: 'Jeopardy!',
    cmd: 'http://www.j-archive.com/showgame.php?game_id=5137 ".clue_text|bold, .clue div[onmouseover]@onmouseover|regex correct_response.>(.*?)<|gray|before \\n" --sep " / "'
  }];


function action(program) {
  var choice = program.args[0],
    prompt;

  if (choice) {
    if (choice > samples.length || parseInt(choice, 10) != choice) {
      console.log(utils.error('Incorrect sample number.'));
    } else {
      runSample(null, choice);
      return;
    }
  }

  // number the labels
  _(samples).each(function(s, i){
    s.label = (1+i) + '. ' + s.label;
  });

  prompt = '\nChoose a sample to run:\n' + _(samples).pluck('label').join('\n') + '\n\n> ';
  promptly.choose(prompt, _.range(1, samples.length + 1), runSample);
}


var runSample = exports.runSample = function runSample(err, choice, silent, callback){
  --choice;
  var sample_cmd = _(samples).pluck('cmd')[choice],
    label = _(samples).pluck('label')[choice];

  runCmd(sample_cmd, label, silent, callback);
};

var runCmd = exports.runCmd = function runCmd(sample_cmd, label, silent, callback){
  var exec = require('child_process').exec,
    path = require('path'),
    cmd = ['node',
        process.argv[1],
        sample_cmd,
        process.argv.slice(4).join(' ')
    ].join(' ');

  !silent && console.log('Running: ', utils.info(cmd + '\n'), utils.chalk.bold.magenta(label));

  exec(cmd, {} ,callback || function(err, stdout, stderr){
    err && console.log(err);
    console.log(stderr);
    console.log(stdout);
    process.exit();
  });
};
