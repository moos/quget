# qsel -  web snippets from the command-line

[![NPM version](https://img.shields.io/npm/v/qsel.svg)](https://www.npmjs.com/package/qsel)
[![Build Status](https://img.shields.io/travis/moos/quget/master.svg)](https://travis-ci.org/moos/quget)

## Introduction
qsel (formerly `quget`) brings together the power of [request](https://github.com/request/request), [cheerio](https://github.com/cheeriojs/cheerio), and jQuery-like CSS selectors to the command-line.


```bash
$ qsel http://news.ycombinator.com ".title > a" --limit 3
Best things and stuff of 2015
When coding style survives compilation: De-anonymizing programmers from binaries
Postgres features and tips
```

```bash
$ qsel http://www.google.com/search?q=the+price+of+gold "td._dmh < tr|yellow"
Gold Price Per Ounce$1,075.20$3.90
Gold Price Per Gram$34.57$0.13
Gold Price Per Kilo$34,568.46$125.39
```


```bash
$ qsel https://github.com/trending?since=monthly ".repo-list-name|pack" --limit 5
apple / swift
FreeCodeCamp / FreeCodeCamp
MaximAbramchuck / awesome-interviews
oneuijs / You-Dont-Need-jQuery
phanan / koel
```


## Installation
`npm install -g qsel`

## Usage

```text

  Usage: qsel [command] [options] <url> [selector] | -

  Example: qsel http://news.ycombinator.com ".title > a|bold|red" --limit 5

  Options:                                                                                                         
    -T, --template <template>            template "node: {{name}}, text {{.|text}}"                                
    -l, --limit <count>                  limit query to count matches (-count from bottom) (default: 0)            
    -r, --rand                           select randomly from matched set (can be combined with --limit)           
    -j, --json                           full results object as (pretty) JSON                                      
    -c, --compact                        when used with --json, outputs compact format                             
    -n, --line-number                    add line numbers to output
    --request-options <request-options>  options for "request" as relaxed JSON, "{foo: bar}"                       
    -h, --help                           output usage information                                                  
    -V, --version                        output the version number                                                 

Batch processing options:
    - , --stdin                          read <url>(s) from STDIN                                                  
    -o, --outfile <file>                 file to output to (default: stdout)                                       
    -q, --quite                          quite the logging                                                         
    -p, --pause <seconds>                pause between batch requests (default: 0.0 secs)
    --sep <seperator>                    seperator for multiple matches (default: "\n")                            
    --tag <tag>                          enclose complete result in <tag></tag>

Commands:                                                                                              
   samples [N]                          show samples, or run sample N                                   
   help [what]                          get extra help with: pipes, selector, request-options           
```

## Selectors

qsel supports all CSS3, some CSS4 and custom jQuery selectors like `:contains()`.  For complete list see [css-selelct](https://github.com/moos/css-select#supported-selectors), or run `qsel help selector`.

If no `selector` is given, the complete HTML of the page is returned.

## Attributes

In general qsel returns the `text()` of the matched nodes.  To select an attribute, add the [x-ray](https://github.com/lapwinglabs/x-ray)-like `@` to the selector (*before the pipes!*).

- `selector@<attr-name>` - get an attribute by name, e.g., `selector@href`
- `selector@text` - get text content of matched nodes recursively (default)
- `selector@html` - get the innerHTML

Multiple attributes are supported: `selector@id@class`.


## Filters / Pipes

qsel supports [Markup.js](https://github.com/adammark/Markup.js)-type pipes separated by `|`, for example, `selector|upcase`, `selector|pack|tease 7`. For complete list see Markup.js' [built-in pipes](https://github.com/adammark/Markup.js#built-in-pipes).

Need some emphasis or color? All [chalk.styles](https://github.com/chalk/chalk#styles) are available as pipes as well: e.g. `selector|red`, `selector|bold|bgBlue`.

Additional pipes are defined in (src/pipes/basic.js):

- `|after text` - add text after each match
- `|before text` - add text before each match
- `|quote text` - add text before and after each match
- `|tag name` - enclose match in &lt;name&gt; and &lt;/name&gt;
- `|incr N` - increment the match value by N (default 1)  
- `|decr N` - decrement the match value by N (default 1)
- `|regex (foo.*)` - match by regex
- `|colorize` - apply random chalk style to every line

Use `\n` to add a new line, e.g. `selector|after \n\n`. For complete list, run `qsel help pipes`.

## Shell pipe

qsel can be forced to read from STDIN, either interactively or in a shell pipe, by providing the single dash option `-`.  In this mode, each line of input is read as a url and executed in order.  Each line may also contain its own `selector`.  If none is given, the `selector` from the CLI is used.

```shell
$ qsel http://news.ycombinator.com ".title > a@href" -l 3 | qsel - "title|pack"
Page not found | Docker Blog
Permission to Fail - Michelle Wetzler of Keen IO
The Amazon Whisperer
```

## Examples

For other examples, run `qsel samples`. (Note: samples are run using Node's `child_process.exec()` which gobbles colors in output streams.  To see the colors, run the command directly from the shell.)

#### Run samples interactively
```bash
$ qsel samples
Choose a sample to run:
1. Hacker News titles
2. Hacker News titles and subtext
3. Wikipedia's On This Day
4. GitHub trending
5. Markup filters
6. Cheerio selectors
7. Beijing Air Twitter feed
8. Custom template 1
9. Custom template 2
10. Jeopardy!
>
```

#### Run a sample
```bash
$ qsel samples 1
Running:
qsel http://news.ycombinator.com ".title > a" -l 7 -n
 Hacker News titles

 1. Apple, Google ban location tracking in apps using their contact-tracing system
 2. Extremely disillusioned with technology. Please help
 3. Stealing your SMS messages with iOS 0day
 4. Experts Doubt the Sun Is Burning Coal (1863)
 5. I gave away my books and sales increased
 6. Iloveyou
 7. Backblaze B2 Cloud Storage Now Has S3 Compatible APIs
 ```

#### Simple
```bash
$ qsel http://www.google.com/search?q=the+price+of+gold "td._dmh < tr" --limit 1
Gold Price Per Ounce$1,075.20$3.90
```

#### With JSON output
```bash
$ qsel http://www.google.com/search?q=the+price+of+gold "td._dmh < tr" --limit 1 --json
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

#### With JSON compact
```bash
$ qsel http://www.google.com/search?q=the+price+of+gold "td._dmh < tr" --limit 1 --json --compact
[{"type":"tag","name":"tr","attribs":{},"children":[{"type":"tag","name":"td","attribs":{"class":"_dmh"},"children":[{"data"
:"Gold Price Per Ounce","type":"text"}]},{"type":"tag","name":"td","attribs":{"class":"_dmh"},"children":[{"data":"$1,075.20
","type":"text"}]},{"type":"tag","name":"td","attribs":{"class":"_dmh"},"children":[{"data":"$3.90","type":"text"}]}],"selec
torIndex":0}]
```

#### With line numbers
```bash
$ qsel http://www.google.com/search?q=the+price+of+gold "td._dmh < tr" -n
1. Gold Price Per Ounce$1,075.20$3.90
2. Gold Price Per Gram$34.57$0.13
3. Gold Price Per Kilo$34,568.46$125.39
```

#### Select at random
```text
$ qsel "https://www.reddit.com/r/oneliners/top/?sort=top&t=year" "a.title|colorize" --limit 3 --rand
"DO NOT TOUCH" must be one of the most terrifying things to read in braille.
I can't believe no one has managed to come up with a cure for anorexia yet, honestly, I thought it'd be a piece of.
Gravity is one of the most fundamental forces in the universe, but if you remove it, you get gravy.
```

#### Custom template
```text
$ qsel http://www.google.com/search?q=the+price+of+gold "td._dmh < tr|yellow"  -T "#{{index|incr}} {{ty
pe|upcase}} {{name}} has {{children.length}} children: {{.|text}}"
#1 TAG tr has 3 children: Gold Price Per Ounce$1,075.20$3.90
#2 TAG tr has 3 children: Gold Price Per Gram$34.57$0.13
#3 TAG tr has 3 children: Gold Price Per Kilo$34,568.46$125.39
```
See [Markup.js](https://github.com/adammark/Markup.js) for template help.

#### Custom HTTP headers
Any options for [request](https://github.com/request/request#requestoptions-callback) can be entered in a *relaxed* [jsonic](https://github.com/rjrodger/jsonic) format using `--request-options`.

```bash
$ qsel https://api.github.com/users/moos
Request forbidden by administrative rules. Please make sure your request has a User-Agent header (http://developer.github.com/v3/#user-agent-required). Check https://developer.github.com for other possible causes.

$ qsel https://api.github.com/users/moos  --request-options "headers:{\"User-Agent\":foo}"
{"login":"moos","id":233047,"avatar_url":"https://avatars.githubusercontent.com/u/233047?v=3", [snip]
```

#### Define an alias
```bash
$ alias def='function _blah(){ qsel https://www.bing.com/search?q=define+$@ "#b_results ol:first-child|bold"; };_blah'
$ def foo
  a term used as a universal substitute for something real, especially when discussing technological ideas and problems
```

## Package note
qsel relies on a [fork of css-select](https://github.com/moos/css-select) which supplies the matched selector index in the list of matched elements.  Since css-select is a dependency of cheerio, it ues `npm shrinkwrap` to load the fork.  Any updates to cheerio will require manually updating the shrinkwrap json file.  Hopefully with upcoming npm 3's flat dependency tree, this shebang can be eliminated.

## Change log

- 0.7.1 - Add better logging for batch ops.
- 0.7.0 - Add `--tag` option.  Write results out incrementally in batch ops.
- 0.6.0 - Add `---pause` option for batch operations
- 0.5.0 - Renamed package to **qsel** (query selector)
- 0.4.1 - Add `|tag foo` pipe.
- 0.4.0 - Add `--outfile` and `--quite` options
- 0.3.3 - Update cheerio to 0.22.0 compatible with lodash 4.17
- 0.3.2 - Use moos/cheerio to pick up moos/css-select.  
- 0.3.1 - Add `npm-shrinkwrap.json` back in as it's needed to pick up the right `css-select` for `cheerio`
- 0.3.0 - Fix reading multiple URLs from STDIN
- 0.2.4 - Early version

## License

(The MIT License)
