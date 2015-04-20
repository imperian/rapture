define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

// used by objective-c
var cFunctions = exports.cFunctions = "\\b(?:(?:alloc|alpha|append_log|atcp_msg|backup|check_tasks|clear(?:_(?:game|player|replica|room)_task)?|debugout|decrement_replica_(?:data|var)|delete|doverb|expand|fclose|feof|fget_(?:byte|data|memory|variable)|file_(?:length|lines)|find_(?:repflag|replica)|fopen|fpos|fput_(?:byte|data|line|memory|string|variable)|fremove|frename|fseek(?:_line)?|game_task|game_task_time|input|insert|ipwhitelist_(?:add|remove)|length|make_path|mdist|memcpy|memset|message|mfrac|mpow|msgstr|msqrt|next_player|node_set_ip|numeric|ord|player_task(?:_time)?|pop|pos|profiling_(?:off|on)|push|raise_error|random|realloc|reload|replica_task(?:_time)?|reset_profiles|room_task(?:_time)?|rsql_(?:cleanup|connect|execute|fetch_row|fetch_row_v|last_insert_id|num_rows|ping|prepare|query_param|release|seek_row)|search_(?:object|persona|player|replica|replica_room|room|verb)|send_memory|send_prompt|shift|size|stamp2time|system|unshift|val|valid_message|wait_for_input|words)\\b|(?:ansicolor|chr|fget_line|fget_string|ftempname|join|left|lower|md5|mid|msg|pop|profile_result|replace|right|rsql_(?:connection_info|error|row_data)|shift|string|time2stamp|upper|words)\\$|(?:clone|game_tasks|ipwhitelist_list|player_tasks|replica_tasks|room_tasks|splitc?|words)@)"

var raptureHighlightRules = function() {

    var keywordControls = (
        "break|case|continue|default|do|else|for|if|in|" +
        "return|switch|while|then"
    );
    
    var storageType = (
        "local|global|subroutine|function|database|dbalias|verb|task"
    );

    var storageModifiers = (
        "extern"
    );

    var keywordOperators = (
        "and|or"
    );

    var builtinConstants = (
        "TRUE|FALSE"
    );

    var keywordMapper = this.$keywords = this.createKeywordMapper({
        "keyword.control" : keywordControls,
        "storage.type" : storageType,
        "storage.modifier" : storageModifiers,
        "keyword.operator" : keywordOperators,
        "variable.language": "this",
        "constant.language": builtinConstants
    }, "identifier");

    var identifierRe = "[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\d\\$_\u00a1-\uffff]*\\b";

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = { 
        "start" : [
            DocCommentHighlightRules.getStartRule("doc-start"),
            {
                token : "comment", // multi line comment
                regex : "\\(\\*",
                next : "comment"
            }, {
                token : "string", // single line
                regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token : "string", // multi line string start
                regex : '["].*\\\\$',
                next : "qqstring"
            }, {
                token : "string", // single line
                regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
            }, {
                token : "string", // multi line string start
                regex : "['].*\\\\$",
                next : "qstring"
            }, {
                token : "constant.numeric", // float
                regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"
            }, {
                token : "keyword", // pre-compiler directives
                regex : "#\\s*(?:include|import|pragma|line|define|undef)\\b",
                next  : "directive"
            }, {
                token : "keyword", // special case pre-compiler directive
                regex : "#\\s*(?:endif|if|ifdef|else|elif|ifndef)\\b"
            }, {
                token : "support.function",
                regex : cFunctions
            }, {
                token : keywordMapper,
                regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token : "keyword.operator",
                regex : "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|==|=|!=|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|new|delete|typeof|void)"
            }, {
              token : "punctuation.operator",
              regex : "\\?|\\:|\\,|\\;|\\."
            }, {
                token : "paren.lparen",
                regex : "[[({]"
            }, {
                token : "paren.rparen",
                regex : "[\\])}]"
            }, {
                token : "text",
                regex : "\\s+"
            }
        ],
        "comment" : [
            {
                token : "comment", // closing comment
                regex : ".*?\\*\\)",
                next : "start"
            }, {
                token : "comment", // comment spanning whole line
                regex : ".+"
            }
        ],
        "qqstring" : [
            {
                token : "string",
                regex : '(?:(?:\\\\.)|(?:[^"\\\\]))*?"',
                next : "start"
            }, {
                defaultToken : "string"
            }
        ],
        "qstring" : [
            {
                token : "string",
                regex : "(?:(?:\\\\.)|(?:[^'\\\\]))*?'",
                next : "start"
            }, {
                defaultToken : "string"
            }
        ],
        "directive" : [
            {
                token : "constant.other.multiline",
                regex : /\\/
            },
            {
                token : "constant.other.multiline",
                regex : /.*\\/
            },
            {
                token : "constant.other",
                regex : "\\s*<.+?>",
                next : "start"
            },
            {
                token : "constant.other", // single line
                regex : '\\s*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]',
                next : "start"
            }, 
            {
                token : "constant.other", // single line
                regex : "\\s*['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']",
                next : "start"
            },
            // "\" implies multiline, while "/" implies comment
            {
                token : "constant.other",
                regex : /[^\\\/]+/,
                next : "start"
            }
        ]
    };

    this.embedRules(DocCommentHighlightRules, "doc-",
        [ DocCommentHighlightRules.getEndRule("start") ]);
};

oop.inherits(raptureHighlightRules, TextHighlightRules);

exports.raptureHighlightRules = raptureHighlightRules;
});
