/*!
 * quget -- simple wget with css selector
 *
 * @copyright github.com/moos
 * @license MIT
 */

var
  utils = require('./utils'),
  request = require('request');


exports.run = function run(url, selector, options) {

  // make request
  request(url, function (err, response, html) {
    if (err) {
      console.log(utils.error(err));
      return;
    }

    if (!selector) {
      console.log(html);
      return;
    }

    // parse selector(s)
    var cheerio = require('cheerio'),
      Mark = require('markup-js'),
      opt = {selectors: true},
      selectors = (selector.trim().split(/\s*,\s*/)),
      selectorStr = selectors.join(',').replace(/@[\w-_]+/g, '').replace(/\|\w+>?\w*/g, ''),
      coll = [],
      results, str;

    $ = cheerio.load(html, opt);
    results = $(selectorStr);

    initMark(Mark, $);

    results.each(function (i) {
      // 'this' is the matched node
      this.index = i;

      if (options.template) {
        str = Mark.up(options.template, this);
      } else {
        var sel = selectors[this.selectorIndex],
          attr = sel.match(/\@([\w-_]+)/g) || [0],
          pipes = sel.match(/\|.*$/) || '',
          tmpl = attr.map(attrize).map(function tokenize(token){
            return '{{.|'+ token + pipes + '}}';
          }).join(' ');

        if (options.lineNumber) tmpl = '{{index|incr}}. ' + tmpl;
        str = Mark.up(tmpl, this);
      }

      coll.push(str);
      if (options.limit > 0 && 1+i >= options.limit) return false;
    });

    output = coll.join(options.sep);
    console.log(output);
  });
};


function attrize(attr){
  return !attr ? 'text' : 'attr>' + attr.replace('@','');
}


function initMark(Mark, $) {

  Mark.pipes.text = function(str){
    return $(str).text();
  };

  Mark.pipes.html = function(str){
    return $(str).html(); // TODO get recursive!!
  };

  Mark.pipes.attr = function(str, name){
    return $(str).attr(name) || '';
  };

  Mark.pipes.quote = function(str, text){
    if (text === 'br') text = '\n';
    return text + str + text;
  };

  Mark.pipes.before = function(str, text){
    if (text === 'br') text = '\n';
    return text + str;
  };

  Mark.pipes.after = function(str, text){
    if (text === 'br') text = '\n';
    return str + text;
  };

  Mark.pipes.incr = function(str, count){
    count = count || 1;
    return Number(str) + count;
  };

  Mark.pipes.decr = function(str, count){
    count = count || 1;
    return Number(str) - count;
  };
}

