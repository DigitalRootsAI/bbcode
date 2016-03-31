var VERSION = '0.3.0',
// default options
    defaults = {
        showQuotePrefix: true,
        classPrefix: 'bbcode_',
        mentionPrefix: '@'
    };

export var version = VERSION;

// copied from here:
// http://blog.mattheworiordan.com/post/13174566389/url-regular-expression-for-links-with-or-without-the had to make an
// update to allow / in the query string, since some sites will have a / there made another update to support colons in
// the query string made another update to disallow an ending dot(.)
var URL_PATTERN = new RegExp("(" // overall match
    + "(" // brackets covering match for protocol (optional) and domain
    + "([A-Za-z]{3,9}:(?:\\/\\/)?)" // allow something@ for email addresses
    + "(?:[\\-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9\\.\\-]+[A-Za-z0-9\\-]"
    // anything looking at all like a domain, non-unicode domains
    + "|" // or instead of above
    + "(?:www\\.|[\\-;:&=\\+\\$,\\w]+@)" // starting with something@ or www.
    + "[A-Za-z0-9\\.\\-]+[A-Za-z0-9\\-]" // anything looking at all like a domain
    + ")" // end protocol/domain
    + "(" // brackets covering match for path, query string and anchor
    + "(?:\\/[\\+~%\\/\\.\\w\\-_]*)?" // allow optional /path
    + "\\??(?:[\\-\\+=&;%@\\.\\w_\\/:]*)" // allow optional query string starting with ?
    + "#?(?:[\\.\\!\\/\\\\\\w]*)" // allow optional anchor #anchor
    + ")?" // make URL suffix optional
    + ")");

function doReplace(content, matches, options) {
    var i, obj, regex, hasMatch, tmp;
    // match/replace until we don't change the input anymore
    do {
        hasMatch = false;
        for (i = 0; i < matches.length; ++i) {
            obj = matches[i];
            regex = new RegExp(obj.e, 'gi');
            tmp = content.replace(regex, obj.func.bind(undefined, options));
            if (tmp !== content) {
                content = tmp;
                hasMatch = true;
            }
        }
    } while (hasMatch);
    return content;
}

function listItemReplace(options, fullMatch, tag, value) {
    return '<li>' + value.trim() + '</li>';
}

export var extractQuotedText = function (value, parts) {
    var quotes = ["\"", "'"], i, quote, nextPart;

    for (i = 0; i < quotes.length; ++i) {
        quote = quotes[i];
        if (value && value[0] === quote) {
            value = value.slice(1);
            if (value[value.length - 1] !== quote) {
                while (parts && parts.length) {
                    nextPart = parts.shift();
                    value += " " + nextPart;
                    if (nextPart[nextPart.length - 1] === quote) {
                        break;
                    }
                }
            }
            value = value.replace(new RegExp("[" + quote + "]+$"), '');
            break;
        }
    }
    return [value, parts];
};

export var parseParams = function (tagName, params) {

    var parts, rv, part, index, paramMap = {};

    if (!params) {
        return paramMap;
    }

    // first, collapse spaces next to equals
    params = params.replace(/\s*[=]\s*/g, "=");
    parts = params.split(/\s+/);

    while (parts.length) {
        part = parts.shift();
        // check if the param itself is a valid url
        if (!URL_PATTERN.exec(part)) {
            index = part.indexOf('=');
            if (index > 0) {
                rv = extractQuotedText(part.slice(index + 1), parts);
                paramMap[part.slice(0, index).toLowerCase()] = rv[0];
                parts = rv[1];
            }
            else {
                rv = extractQuotedText(part, parts);
                paramMap[tagName] = rv[0];
                parts = rv[1];
            }
        } else {
            rv = extractQuotedText(part, parts);
            paramMap[tagName] = rv[0];
            parts = rv[1];
        }
    }
    return paramMap;
};


function tagReplace(options, fullMatch, tag, params, value) {
    var tmp, className, inlineValue, i, val;

    tag = tag.toLowerCase();
    params = parseParams(tag, params || undefined);
    inlineValue = params[tag];

    switch (tag) {
        case 'quote':
            val = '<div class="' + options.classPrefix + 'quote"';
            for (i in params) {
                tmp = params[i];
                if (!inlineValue && (i === 'author' || i === 'name')) {
                    inlineValue = tmp;
                } else if (i !== tag) {
                    val += ' data-' + i + '="' + tmp + '"';
                }
            }
            return val + '>' + (inlineValue ? inlineValue + ' wrote:' : (options.showQuotePrefix ? 'Quote:' : '')) + '<blockquote>' + value + '</blockquote></div>';
        case 'url':
            return '<a class="' + options.classPrefix + 'link" target="_blank" href="' + (inlineValue || value) + '">' + value + '</a>';
        case 'email':
            return '<a class="' + options.classPrefix + 'link" target="_blank" href="mailto:' + (inlineValue || value) + '">' + value + '</a>';
        case 'anchor':
            return '<a name="' + (inlineValue || params.a || value) + '">' + value + '</a>';
        case 'b':
            return '<strong>' + value + '</strong>';
        case 'i':
            return '<em>' + value + '</em>';
        case 'u':
            return '<span style="text-decoration:underline">' + value + '</span>';
        case 's':
            return '<span style="text-decoration:line-through">' + value + '</span>';
        case 'indent':
            return '<blockquote>' + value + '</blockquote>';
        case 'list':
            tag = 'ul';
            className = options.classPrefix + 'list';
            if (inlineValue && /[1Aa]/.test(inlineValue)) {
                tag = 'ol';
                if (/1/.test(inlineValue)) {
                    className += '_numeric';
                }
                else if (/A/.test(inlineValue)) {
                    className += '_alpha';
                }
                else if (/a/.test(inlineValue)) {
                    className += '_alpha_lower';
                }
            }
            val = '<' + tag + ' class="' + className + '">';
            //  parse the value
            val += doReplace(value, [{e: '\\[([*])\\]([^\r\n\\[\\<]+)', func: listItemReplace}], options);
            return val + '</' + tag + '>';
        case 'code':
        case 'php':
        case 'java':
        case 'javascript':
        case 'cpp':
        case 'ruby':
        case 'python':
            return '<pre class="' + options.classPrefix + (tag === 'code' ? '' : 'code_') + tag + '">' + value + '</pre>';
        case 'highlight':
            return '<span class="' + options.classPrefix + tag + '">' + value + '</span>';
        case 'html':
            return value;
        case 'mention':
            val = '<span class="' + options.classPrefix + 'mention"';
            if (inlineValue) {
                val += ' data-mention-id="' + inlineValue + '"';
            }
            return val + '>' + (options.mentionPrefix || '') + value + '</span>';
        case 'span':
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
            return '<' + tag + '>' + value + '</' + tag + '>';
        case 'youtube':
            return '<object class="' + options.classPrefix + 'video" width="425" height="350"><param name="movie" value="http://www.youtube.com/v/' + value + '"></param><embed src="http://www.youtube.com/v/' + value + '" type="application/x-shockwave-flash" width="425" height="350"></embed></object>';
        case 'gvideo':
            return '<embed class="' + options.classPrefix + 'video" style="width:400px; height:325px;" id="VideoPlayback" type="application/x-shockwave-flash" src="http://video.google.com/googleplayer.swf?docId=' + value + '&amp;hl=en">';
        case 'google':
            return '<a class="' + options.classPrefix + 'link" target="_blank" href="http://www.google.com/search?q=' + (inlineValue || value) + '">' + value + '</a>';
        case 'wikipedia':
            return '<a class="' + options.classPrefix + 'link" target="_blank" href="http://www.wikipedia.org/wiki/' + (inlineValue || value) + '">' + value + '</a>';
        case 'img':
            var dims = new RegExp('^(\\d+)x(\\d+)$').exec(inlineValue || '');
            if (!dims || (dims.length !== 3)) {
                dims = new RegExp('^width=(\\d+)\\s+height=(\\d+)$').exec(inlineValue || '');
            }
            if (dims && dims.length === 3) {
                params = undefined;
            }
            val = '<img class="' + options.classPrefix + 'image" src="' + value + '"';
            if (dims && dims.length === 3) {
                val += ' width="' + dims[1] + '" height="' + dims[2] + '"';
            } else {
                for (i in params) {
                    tmp = params[i];
                    if (i === 'img') {
                        i = 'alt';
                    }
                    val += ' ' + i + '="' + tmp + '"';
                }
            }
            return val + '/>';
    }
    // return the original
    return fullMatch;
}

/**
 * Renders the content as html
 * @param content   the given content to render
 * @param options   optional object with control parameters
 * @returns rendered html
 */
export var render = function (content, options) {
    var matches = [], tmp;

    options = options || {};
    for (tmp in defaults) {
        if (!Object.prototype.hasOwnProperty.call(options, tmp)) {
            options[tmp] = defaults[tmp];
        }
    }
    // for now, only one rule
    matches.push({e: '\\[(\\w+)(?:[= ]([^\\]]+))?]((?:.|[\r\n])*?)\\[/\\1]', func: tagReplace});
    return doReplace(content, matches, options);
};
