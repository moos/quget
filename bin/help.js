
module.exports = function(program) {

  program
    .command('help [what]')
    .description('get extra help with "what"')
    .action(function (a, b) {
      var what;
      if (program.args.length < 1) program.help(); // exits

      what = program.args[0];

      if (what === 'str') {

        var samples = require('./samples');

        console.log('--str <fn> - apply Underscore.string function, eg, trim, clean, ...');
        console.log('<fn> can be one of:\n');

        samples.runSample(null, 5, true, function (err, stdout, stderr) {
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

};