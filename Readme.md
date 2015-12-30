# quget -  web snippets from the command-line

[![NPM version](https://img.shields.io/npm/v/quget.svg)](https://www.npmjs.com/package/quget)
[![Build Status](https://img.shields.io/travis/moos/quget/master.svg)](https://travis-ci.org/moos/quget)

## Introduction
quget brings together the power of [request](https://github.com/request/request), [cheerio](https://github.com/cheeriojs/cheerio), and jQuery-like CSS selectors to the command-line.


```bash
$ quget http://news.ycombinator.com ".title > a" --limit 3
Best things and stuff of 2015
When coding style survives compilation: De-anonymizing programmers from binaries
Postgres features and tips
```

```bash
$ quget http://www.google.com/search?q=what+is+the+price+of+gold "td._dmh < tr|yellow"
Gold Price Per Ounce$1,075.20$3.90
Gold Price Per Gram$34.57$0.13
Gold Price Per Kilo$34,568.46$125.39
```


```bash
$ quget https://github.com/trending?since=monthly ".repo-list-name|pack" --limit 5
apple / swift
FreeCodeCamp / FreeCodeCamp
MaximAbramchuck / awesome-interviews
oneuijs / You-Dont-Need-jQuery
phanan / koel
```


## Installation
`npm install -g quget`

## Usage

```bash

 Usage: quget [command] [options] <url> [selector]

 Example: quget http://news.ycombinator.com ".title > a|bold|red" -l 5

 Commands:

   samples [N]  show samples, or run sample N
   help [what]  get extra help with: pipes, selector

 Options:

   -h, --help                 output usage information
   -V, --version              output the version number
   -T, --template <template>  template: "node: {{name}}, text {{.|text}}"
   --sep <seperator>          seperator for multiple matches
   -l, --limit <count>        limit results to <count> matches
   -n, --lineNumber           add line numbers to output
   -j, --json                 full results object as JSON
   -c, --compact              when used with --json, outputs compact format
   - , --stdin                read <url>(s) from STDIN, one per line
```

## Selectors

quget supports all CSS3, some CSS4 and custom jQuery selectors like `:contains()`.  For complete list see [css-selelct](https://github.com/moos/css-select#supported-selectors), or run `quget help selector`.

If no `selector` is given, the complete HTML of the page is returned.

## Attributes

In general quget returns the `text()` of the matched nodes.  To select an attribute, add the [x-ray](https://github.com/lapwinglabs/x-ray)-like `@` to the selector (*before the pipes!*).

- `selector@<attr-name>` - get an attribute by name, e.g., `selector@href`
- `selector@text` - get text content of matched nodes recursively (default)
- `selector@html` - get the innerHTML

Multiple attributes are supported: `selector@id@class`.


## Filters / Pipes

quget supports [Markup.js](https://github.com/adammark/Markup.js)-type pipes separated by `|`, for example, `selector|upcase`, `selector|pack`, `selector|pack|tease 7`. For complete list see Markup.js' [built-in pipes](https://github.com/adammark/Markup.js#built-in-pipes).

Need some emphasis or color? All [chalk.styles](https://github.com/chalk/chalk#styles) are available as pipes as well: e.g. `selector|red`, `selector|bold|bgBlue`.

Additional pipes are defined in (src/pipes/basic.js):

- `|after text` - add text after each match
- `|before text` - add text before each match
- `|quote text` - add text before and after each match
- `|incr N` - increment the match value by N (default 1)  
- `|decr N` - decrement the match value by N (default 1)
- `|regex (foo.*)` - match by regex
- `|rand` - select a random match (coming soon)

For complete list, run `quget help pipes`.

## Shell pipe

quget can be forced to read from STDIN, either interactively or in a shell pipe, by providing the single dash option `-`.  In this mode, each line of input is read as a url and executed in order.  Each line may also contain it's own `selector`.  If none is given, the `selector` from the CLI is used.
  
```bash
$ quget http://news.ycombinator.com ".title > a@href" -l 3 | quget - "title|pack"
Page not found | Docker Blog
Permission to Fail - Michelle Wetzler of Keen IO
The Amazon Whisperer
```

## Examples

For other examples, run `quget samples`. (Note: samples are run using Node's `child_process.exec()` which gobbles colors in output streams.  To see the colors, run the command directly from the shell.)

### Run samples interactively
```bash
$ quget samples
Choose a sample to run:
1. Hacker News titles
2. Hacker News titles and subtext
3. Wikipedia's On This Day
4. GitHub trending
5. Markup filters
6. Cheerio selectors
7. Beijing Air Twitter feed
8. Custom template
9. Jeopardy!
>
```

### Run a sample
```bash
$ quget samples 1
Running:
quget http://news.ycombinator.com ".title > a" -l 7 -n
 Hacker News titles

1. Dear Architects: Sound Matters
2. Best things and stuff of 2015
3. Spotify Hit with $150M Class Action Over Unpaid Royalties
4. Dolphin Smalltalk Goes Open-Source
5. Starters and Maintainers
6. Postgres features and tips
7. When coding style survives compilation: De-anonymizing programmers from binaries
```

### Simple
```bash
$ quget http://www.google.com/search?q=what+is+the+price+of+gold "td._dmh < tr" -limit 1
Gold Price Per Ounce$1,075.20$3.90
```

### With JSON output
```bash
$ quget http://www.google.com/search?q=what+is+the+price+of+gold "td._dmh < tr" -limit 1 --json
[
  {
    "type": "tag",
    "name": "tr",
    "attribs": {},
    "children": [
      {
        "type": "tag",
        "name": "td",
        "attribs": {
          "class": "_dmh"
        },
        "children": [
          {
            "data": "Gold Price Per Ounce",
            "type": "text"
          }
        ]
      },
      {
        "type": "tag",
        "name": "td",
        "attribs": {
          "class": "_dmh"
        },
        "children": [
          {
            "data": "$1,075.20",
            "type": "text"
          }
        ]
      },
      {
        "type": "tag",
        "name": "td",
        "attribs": {
          "class": "_dmh"
        },
        "children": [
          {
            "data": "$3.90",
            "type": "text"
          }
        ]
      }
    ],
    "selectorIndex": 0
  }
]
```

### With JSON compact
```bash
$ quget http://www.google.com/search?q=what+is+the+price+of+gold "td._dmh < tr" -limit 1 --json --compact
[{"type":"tag","name":"tr","attribs":{},"children":[{"type":"tag","name":"td","attribs":{"class":"_dmh"},"children":[{"data"
:"Gold Price Per Ounce","type":"text"}]},{"type":"tag","name":"td","attribs":{"class":"_dmh"},"children":[{"data":"$1,075.20
","type":"text"}]},{"type":"tag","name":"td","attribs":{"class":"_dmh"},"children":[{"data":"$3.90","type":"text"}]}],"selec
torIndex":0}]
```

### With line numbers
```bash
$ quget http://www.google.com/search?q=what+is+the+price+of+gold "td._dmh < tr" -n
1. Gold Price Per Ounce$1,075.20$3.90
2. Gold Price Per Gram$34.57$0.13
3. Gold Price Per Kilo$34,568.46$125.39
```

### Custom template
```bash
$ quget http://www.google.com/search?q=what+is+the+what+is+the+price+of+gold "td._dmh < tr|yellow"  -T "#{{index|incr}} {{ty
pe|upcase}} {{name}} has {{children.length}} children: {{.|text}}"
#1 TAG tr has 3 children: Gold Price Per Ounce$1,075.20$3.90
#2 TAG tr has 3 children: Gold Price Per Gram$34.57$0.13
#3 TAG tr has 3 children: Gold Price Per Kilo$34,568.46$125.39
```
See [Markup.js](https://github.com/adammark/Markup.js) for template help.

### Define an alias
```bash
$ alias def='function _blah(){ quget https://www.bing.com/search?q=define+$@ "#b_results ol:first-child|bold"; };_blah'
$ def foo
  a term used as a universal substitute for something real, especially when discussing technological ideas and problems
```

## Package note
quget relies on a [fork of css-select](https://github.com/moos/css-select) which supplies the matched selector index in the list of matched elements.  Since css-select is a dependency of cheerio, it ues `npm shrinkwrap` to load the fork.  Any updates to cheerio will require manually updating the shrinkwrap json file.  Hopefully with upcoming npm 3's flat dependency tree, this shebang can be eliminated.
```bash
$ def shebang
informala matter, operation, or set of circumstances: "the Mafia boss who's running the whole shebang"N. AMER. archaica rough hut or shelter.
```

## License

(The MIT License)
