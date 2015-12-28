

module.exports = function(Mark, $) {

  Mark.pipes.text = function(str){
    return $(str).text();
  };

  // NOTE: only return first match!
  Mark.pipes.html = function(str){
    return $(str).html();
  };

  Mark.pipes.attr = function(str, name){
    // handle special case:
    if (name === 'html') return Mark.pipes.html(str);
    if (name === 'text') return Mark.pipes.text(str);

    return $(str).attr(name) || '';
  };

};
