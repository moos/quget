var utils = require('../src/utils'),
  _ = require('underscore'),
  promptly = require('promptly');


exports.init = function(program) {
  program
    .command('samples [N]')
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
    cmd: 'http://news.ycombinator.com ".title > a, .subtext|pack|after \\n|red" -l 14'
  }, {
    label: 'Wikipedia\'s On This Day',
    cmd: 'http://en.wikipedia.org/wiki/Main_Page "#mp-otd > p:first-of-type, #mp-otd > ul:first-of-type > li|tease 15"'
  }, {
    label: 'GitHub trending',
    cmd: 'https://github.com/trending?since=weekly ".repo-list-name|pack, .repo-list-description|tease 7|after \\n" --limit 20'
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
    label: 'Custom template',
    cmd: 'https://twitter.com/BeijingAir "#stream-items-id > li div.tweet div.content p" --limit 25 -T "{{parent.children.1|text|red}}"'
  }, {
    label: 'Jeopardy!',
    cmd: 'http://www.j-archive.com/showgame.php?game_id=5137 ".clue_text|bold, .clue div[onmouseover]@onmouseover|regex correct_response.>(.*?)<|gray|before \\n" --sep " / "'
  }];


function action(program) {
  var choice,
    prompt;

  if (program.args[0]) {
    choice = program.args[0];
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
  var sample_cmd = _(samples).pluck('cmd')[ choice - 1],
    exec = require('child_process').exec,
    path = require('path'),
    cmd = 'node ' + process.argv[1] + ' ' + sample_cmd;

  !silent && console.log('Running: ', utils.info(cmd + '\n'), utils.chalk.bold.magenta(_(samples).pluck('label')[choice - 1]));

  exec(cmd, {} ,callback || function(err, stdout, stderr){
    err && console.log(err);
    console.log(stderr);
    console.log(stdout);
    process.exit();
  });
};
