

module.exports = function(Mark, opt) {

  require('./pipes/basic.js')(Mark);
  require('./pipes/cheerio.js')(Mark, opt.$);
  require('./pipes/chalk.js')(Mark, opt.chalk);

};
