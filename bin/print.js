var
  _ = require('underscore'),
  CSSwhat = require('CSSwhat'),
  columnify = require('columnify'),
  Mark = require('markup-js');


//Mark.delimiter = ':';
Mark.includes.incl = function(str){
  console.log('incl', str)
  return 'html incl: ' + $(res[0]).html();
};

Mark.pipes.quote = function (str, q) {
  q = q || '"';
  return q + str + q;
};

// TODO $


function prepResult() {
  var res = this;
  var $res = $(res);
//  console.log(1111, res, Object.keys($res).join(), $res.text(), typeof $res);

  // map getters
  // TODO 'index' is undefined!
  'text css eq first last is val data'.split(' ').forEach(function (key) {
    res[key] = $res[key].bind($res)
    return;

  });
  res.attr = res.attribs; // alias
  // return outer html
  res.html = function () {
    return $.html($res)
  };
  // return outer html
  res.innerHTML = function () {
    return $res.html()
  };

  // add selector res.$<i> matches parse selector i
  parsedSelectors.forEach(function(sel, i) {
    res[ '$' + (++i) ] = function () {
      return sel === res.selector ? res : 'NO SELETOR MATCH';
    };
  });
}


function printOut() {
  var res = this;

  a = Mark.up(
      '\ntag: {{type|upcase}} {{name}}' +
//    '\nhtml: {.|html} \ntext: {.|text}\n {{attr.a}} ' +
      '\nhtml upcase {{html|upcase|quote}} ' +
      '\ninnerHTML downcase {{innerHTML|downcase|quote}} ' +
      '\ntext {{text|quote}}' +
      '\nselector {{selector|quote}}' +

        // TODO sel index is last one, do this...
        // {{$1}} ... {{/$1}}  matched by selector 1, etc.
       '\n$1 === {{$1}} {{html}} {{/$1}}' +
       '\n$2 === {{$2}} {{html}} {{/$2}}' +
       '\n$3 === {{$3}} {{html}} {{/$3}}' +
      '\naa={{attr.aa}} class={{attr.class}} data={{data}} '
    , res);
  console.log(a);
}


exports.print = function print(_$, template, res, _p) {

  $ = _$;
  parsedSelectors = _p;

  res.each(prepResult);
//  console.log(2222, Object.keys(res[0]).join());

  res.each(printOut);
};
