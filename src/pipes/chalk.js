

module.exports = function(Mark, chalk) {
  //console.log(chalk.styles)

  var styles = Object.keys(chalk.styles);

  // inherit chalk.styles as pipes
  styles.forEach(function(style){
    Mark.pipes[ style ] = chalk[ style ];
  });


  Mark.pipes.colorize = function(str){
    var style = require('underscore')(styles).sample();
    return Mark.pipes[ style ](str);
  };

};
