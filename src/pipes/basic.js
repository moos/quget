

module.exports = function(Mark) {

  Mark.pipes.after = function(str, text){
    text = sanitize(text);
    return str + text;
  };
  Mark.pipes.after.help = 'Insert text after (use \\t & \\n for tab and newline): |after Done.\\n';


  Mark.pipes.before = function(str, text){
    text = sanitize(text);
    return text + str;
  };
  Mark.pipes.before.help = 'Insert text before: |before Title\\t';


  Mark.pipes.quote = function(str, text){
    if (text === 'br') text = '\n';
    return text + str + text;
  };
  Mark.pipes.quote.help = 'Surround with text: |quote \\n';


  Mark.pipes.incr = function(str, count){
    count = count || 1;
    return Number(str) + count;
  };
  Mark.pipes.incr.help = 'Increment by count (default: 1): |incr 2';


  Mark.pipes.decr = function(str, count){
    count = count || 1;
    return Number(str) - count;
  };
  Mark.pipes.decr.help = 'Decrement by count (default: 1): |decr';


  Mark.pipes.regex = function(str, regex){
    regex = new RegExp(regex);
    return (str.match(regex) || [])[1];
  };
  Mark.pipes.regex.help = 'Regular expression match: |regex foo(.*?)bar';


  // rand is handled at the results level
  Mark.pipes.rand = function(str){
    return str;
  };
  Mark.pipes.rand.help = 'Select from the matches at random (rand is global, it\' applied to all the selectors)';


  function sanitize(text) {
    return text
      .replace(/\\t/g, '\t')
      .replace(/\\n/g, '\n')
  }

};
