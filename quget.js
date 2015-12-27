var
  _ = require('underscore'),
  CSSwhat = require('CSSwhat'),
  columnify = require('columnify'),
//  xrayParse = require('x-ray-parse'),
  _chalk;


//console.log(xrayParse('div.bar@href@foo|trim |tram'));
//return;

var parts = [],
  options = {},
  $;

exports.run = function run(url, selector, opts) {
//  console.log(arguments);
  var
    request = require('request');

  options = opts;

  // make request
  request(url, function (err, response, html) {
    if (err) {
      console.log(error(err));
      return;
    }

    if (!selector) {
      console.log(html);
      return;
    }

    var cheerio = require('cheerio'),
      opt = {selectors: true},
      Mark = require('markup-js'),
      selectors = (selector.trim().split(/\s*,\s*/)), //.map(parse),
//      selectorStr = _(selectors).pluck('selector').join(','),
      cleanSelector = selectors..replace(/@\w+/g, '').replace(/\|\w+>?\w*/g, ''),  // SAFE?
      coll = [],
      results, str;

    console.log(selector, 11, selectors, 22, selectorStr);
    console.log(_(selectors).pluck('filters'))
    return;

    $ = cheerio.load(html, opt);
    results = $(selectorStr);

    initMark(Mark);

//    console.log(cleanSelector, selectors, results[0]);
//    console.log(results.text());



    // NOTE: text() returns for all matched elements, but html() for first one only!
    results.each(function (i) {
//      console.log(111, this.selector, this);

      this.index = i;

      if (this.selector) {
        var sel = selectors[this.selectorIndex],
          attr = sel.match(/\@([\w-_]+)/g) || [0],
          pipes = sel.match(/\|.*$/) || '',
          tmpl = attr.map(attrize).map(tokenize).join(' ');

        function attrize(attr){
          return !attr ? 'text' : 'attr>' + attr.replace('@','');
        }
        function tokenize(token, index){
          return '{{.|'+ token + pipes + '}}';
        }

        if (options.linenumber) tmpl = '{{index|inc}}. ' + tmpl;

//        console.log(attr, tmpl)

        str = Mark.up(tmpl, this);

      } else if (options.template) {
        str = Mark.up(options.template || '<no template give>', this);
      } else {

        str = extract($, this);
        if (options.linenumber) {
//        str = (+options.linenumber + i) + ' ' + str;
        }
      }

      coll.push(str);
      if (options.limit > 0 && ++i >= options.limit) return false;
    });

    output = coll.join(options.sep);
    console.log(output);
//    output(coll);
  });

}



function initMark(Mark) {
//  console.log('Mark.pipes', Object.keys(Mark.pipes).join());

//  Mark.delimiter = ':';

  Mark.includes.html = function(str){

  };

  Mark.pipes.text = function(str){
//    console.log(112211, str, $(str).text());
    return $(str).text();// + ' - ' + str.selector +  ' ' + str.selectorIndex;
  };

  Mark.pipes.attr = function(str, name){
//    console.log('attr', str, name);
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

  Mark.pipes.inc = function(str, count){
    count = count || 1;
    return Number(str) + count;
  };
}


function output(coll){

  coll.forEach(function(item){
    Object.keys(item).forEach(function(key){
      console.log(item[key])
    })
  })
}

function extract($, result) {
  var obj = {},
    $result = $(result),
    _s = require('underscore.string'),
    value, name;

  parts.forEach(function(what, i){
    if (what.indexOf(':') > -1) { // eg, attr:width
      what = what.split(':');
      name = what[1]; // width
      what = what[0]; // attr
    }

    if (what === 'html') {
      value = $.html(result);
    } else {
      value = name ? $result[ what ](name) : $result[ what ]();
      options.trim && (value = value.trim());
      if (options.str && options.str in _s) {
        value = _s[ options.str ](value);
      }
    }

    obj[ parts[i] ] = value;
  });

  console.log(33333, obj)
//  return JSON.stringify(obj);
  return obj;
}

function error(text){

  return chalk().bold.red(text);
}

function info(text){
  return chalk().bold.green(text);
}

function chalk(){
  return _chalk || (_chalk = require('chalk'));
}