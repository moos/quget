

module.exports = function(Mark, chalk) {
  //console.log(chalk.styles)

  // inherit chalk.styles as pipes
  Object.keys(chalk.styles).forEach(function(style){
    Mark.pipes[ style ] = chalk[ style ];
  });

};
