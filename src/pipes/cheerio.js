

module.exports = function(Mark, $) {

  Mark.pipes.text = function(matches){
    return $(matches).text();
  };

  // NOTE: only returns first match!
  Mark.pipes.html = function(matches){
    return $(matches).html();
  };

  Mark.pipes.attr = function(matches, name){
    // handle special case:
    if (name === 'html') return Mark.pipes.html(matches);
    if (name === 'text') return Mark.pipes.text(matches);

    return $(matches).attr(name) || '';
  };

};
