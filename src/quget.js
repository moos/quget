/*!
 * quget -- Get web snippets from the command-line.
 *
 * @copyright 2016 https://github.com/moos/quget
 * @license MIT
 */

var
  _ = require('underscore'),
  request = require('request'),
  utils = require('./utils');

exports.run = function run(url, selector, options) {
  var req = {
    url: url
  };

  // add request options, if any
  if (options.requestOptions) {
    var jsonic = require('jsonic');
    _.extend(req, jsonic(options.requestOptions));
  }

  return new Promise(function (resolve, reject) {

    // make request
    request(req, function (err, response, html) {
      if (err) {
        console.error(utils.error(err));
        return reject(err);
      }
      if (!selector) {
        return resolve(html);
      }

      // parse selector(s)
      var cheerio = require('cheerio'),
        Mark = require('markup-js'),
        reSeperator = /\s*,\s*/,
        reAttr = /@[\w-_]+/g,
        reFilter = /\s*\|(?!\=)\s*/,
        removeFilter = function (sel) {
          return (sel + ' ').slice(0, sel.search(reFilter));
        },
        selectors = selector.trim().split(reSeperator),
        selectorStr = selectors.map(removeFilter).join(',').replace(reAttr, ''),
        coll = [],
        linenoTmpl = options.lineNumber ? '{{index|incr}}. ' : '',
        count, $, results, output;

      Mark.delimiter = /\s+/;

      // load html & apply selectors
      $ = cheerio.load(html);
      results = $(selectorStr);

      // init filter pipes
      require('./pipes.js')(Mark, {
        $    : $,
        chalk: utils.chalk
      });

      // apply limit
      count = results.length;
      if (options.limit && results.length > options.limit) {
        count = options.limit;
      }
      //console.log('count', count, results.length, options.limit)

      // rand and limit are applied to selector groups
      if (options.rand || options.limit) {
        var grouped = _.chain(results)
            .toArray()
            .each(function (item, n) {
              item.index = n;
            })
            .groupBy('selectorIndex')
            .filter(function (group, n) {
              return n !== 'undefined';
            })
            .value(),
          // group which has min matches
          minGroup = _(grouped).sortBy('length')[0],
          indexList;

        // apply rand
        if (options.rand) {
          // if no limit was given, select 1 at random
          if (options.limit <= 0) count = 1;

          indexList = _.chain(minGroup)
            .pluck('index') // sample based on flat results index
            .sample(count)
            .sortBy()
            .value();

        }
        // apply limit
        else {
          var start = count < 0 ? count + minGroup.length : 0,
            stop = count < 0 ? minGroup.length : count;

          indexList = _.range(start, stop);
        }

        results = $(_
          .chain(indexList)
          .map(function (index) {
            var groupIndex = options.rand ? _(minGroup).findIndex(function (item) {
              return item.index === index;
            }) : index;

            return _(grouped).reduce(function (prev, item) {
              prev.push(item[groupIndex]);
              return prev;
            }, []);
          })
          .flatten()
          .compact()
          .value()
        );
      }

      // handle json
      if (options.json) {
        output = toJSON(Array.from(results), options.compact);
        return resolve(output);
      }

      // parse results
      results.each(function (index) {
        // 'this' is the matched node
        var
          item = this,
          tmpl = options.template || templatize(selectors[item.selectorIndex]),
          $n = '$' + item.selectorIndex,
          str;

        // useful for {{if $0}}...{{/if}} predicates. $n is the n-th matched selector (0-based)
        item[ $n ] = item;

        item.index = index;

        str = Mark.up(linenoTmpl + tmpl, item);
        coll.push(str);
      });

      output = coll.join(options.sep);
      return resolve(output);
    });

  }); // promise
};


// helper function
exports.compactJson = function(data) {
  console.log('%j', data);
};


// get template token for attribute (@attr), otherwise uses text node
function attrize(attr){
  var delim = ' ';  // should match Mark.delimiter
  return !attr ? 'text' : 'attr' +  delim + attr.replace('@','');
}

// generate a template for selection, e.g., 'div a@href|pack'
var templatize = _.memoize(function (sel) {
  var attr = sel.match(/\@([\w-_]+)/g) || [0],
    pipes = sel.match(/\|.*$/) || '',
    tmpl = attr.map(attrize).map(function tokenize(token){
      return '{{.|' + token + pipes + '}}';
    }).join(' ');
  //console.log(sel, 'template', tmpl)
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
