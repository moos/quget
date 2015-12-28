/*!
 * quget -- like wget but with css selectors
 *
 * @copyright 2016 https://github.com/moos/quget
 * @license MIT
 */

var
  utils = require('./utils'),
  _ = require('underscore'),
  request = require('request');


exports.run = function run(url, selector, options) {

  // make request
  request(url, function (err, response, html) {
    if (err) {
      console.log(utils.error(err), url);
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
      reSeperator = /\s*,\s*/,
      reAttr = /@[\w-_]+/g,
      reFilter = /\s*\|(?!\=)\s*/,
      removeFilter = function(sel){
        return (sel + ' ').slice(0, sel.search(reFilter));
      },
      selectors = selector.trim().split(reSeperator),
      selectorStr = selectors.map(removeFilter).join(',').replace(reAttr, ''),
      coll = [],
      $, results, str, output;

    Mark.delimiter = /\s+/;

    // load html & apply selectors
    $ = cheerio.load(html, opt);
    results = $(selectorStr);
//    console.log(results[0]);

    // init filter pipes
    require('./pipes.js')(Mark, {
      $    : $,
      chalk: utils.chalk
    });

    if (options.limit > 0 && results.length >= options.limit) {
      results.length = options.limit;
    }

    if (options.json) {
      if (options.compact) {
        console.log('%j', toJSON(Array.from(results), true));
      } else {
        console.log(toJSON(Array.from(results)));
      }
      return;
    }

    // parse results
    results.each(function (i) {
      // 'this' is the matched node
      this.index = i;

      if (options.template) {
        str = Mark.up(options.template, this);
      } else {
        var tmpl = templatize(selectors[this.selectorIndex]);
        if (options.lineNumber) tmpl = '{{index|incr}}. ' + tmpl;
        str = Mark.up(tmpl, this);
      }

      coll.push(str);
    });

    output = coll.join(options.sep);
    console.log(output);
  });
};

// get template token for attribute (@attr), otherwise uses text node
function attrize(attr){
  var delim = ' ';  // should match Mark.delimeter
  return !attr ? 'text' : 'attr' +  delim + attr.replace('@','');
}

// generate a template for selection, e.g., 'div a@href|pack'
var templatize = _.memoize(function (sel) {
  var attr = sel.match(/\@([\w-_]+)/g) || [0],
    pipes = sel.match(/\|.*$/) || '',
    tmpl = attr.map(attrize).map(function tokenize(token){
      return '{{.|'+ token + pipes + '}}';
    }).join(' ');

  return tmpl;
});

function toJSON(data, deep){
  var out = [];
  data.forEach(function(obj){
    // clean up
    delete obj.next;
    delete obj.prev;
    delete obj.parent;

    if (obj.children) obj.children = toJSON(obj.children, true);
    out.push(obj);
  });

  return deep ? out : JSON.stringify(out, undefined, 2);
}