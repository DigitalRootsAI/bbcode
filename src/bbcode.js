var VERSION = '0.2.0',
// default options
    defaults = {
        showQuotePrefix: true,
        classPrefix: 'bbcode_',
        mentionPrefix: '@'
    };

export var version = VERSION;

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

var listItemReplace = function (options, fullMatch, tag, value) {
    return '<li>' + value.trim() + '</li>';
};

function tagReplace(options, fullMatch, tag, params, value) {
    var tmp, className;

    tag = tag.toLowerCase();
    if (params && params.length >= 2 &&
        ((params[0] === '"' && params[params.length - 1] === '"') ||
        (params[0] === '\'' && params[params.length - 1] === '\''))) {
        params = params.slice(1, -1);
    }
    switch (tag) {
        case 'quote':
            return '<div class="' + options.classPrefix + 'quote">' + (params ? params + ' wrote:' : (options.showQuotePrefix ? 'Quote:' : '')) + '<blockquote>' + value + '</blockquote></div>';
        case 'url':
            return '<a class="' + options.classPrefix + 'link" target="_blank" href="' + (params || value) + '">' + value + '</a>';
        case 'email':
            return '<a class="' + options.classPrefix + 'link" target="_blank" href="mailto:' + (params || value) + '">' + value + '</a>';
        case 'anchor':
            return '<a name="' + (params || value) + '">' + value + '</a>';
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
            if (params && /[1Aa]/.test(params)) {
                tag = 'ol';
                if (/1/.test(params)) {
                    className += '_numeric';
                }
                else if (/A/.test(params)) {
                    className += '_alpha';
                }
                else if (/a/.test(params)) {
                    className += '_alpha_lower';
                }
            }
            tmp = '<' + tag + ' class="' + className + '">';
            //  parse the value
            tmp += doReplace(value, [{e: '\\[([*])\\]([^\r\n\\[\\<]+)', func: listItemReplace}], options);
            return tmp + '</' + tag + '>';
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
            tmp = '<span class="' + options.classPrefix + 'mention"';
            if (params) {
                tmp += ' data-mention-id="' + params + '"';
            }
            return tmp + '>' + (options.mentionPrefix || '') + value + '</span>';
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
            return '<a class="' + options.classPrefix + 'link" target="_blank" href="http://www.google.com/search?q=' + (params || value) + '">' + value + '</a>';
        case 'wikipedia':
            return '<a class="' + options.classPrefix + 'link" target="_blank" href="http://www.wikipedia.org/wiki/' + (params || value) + '">' + value + '</a>';
        case 'img':
            var dims = new RegExp('^(\\d+)x(\\d+)$').exec(params || '');
            if (!dims || (dims.length !== 3)) {
                dims = new RegExp('^width=(\\d+)\\s+height=(\\d+)$').exec(params || '');
            }
            if (dims && dims.length === 3) {
                params = undefined;
            }
            return '<img class="' + options.classPrefix + 'image" src="' + value + '"' + (dims && dims.length === 3 ? ' width="' + dims[1] + '" height="' + dims[2] + '"' : '') + (params ? (' alt="' + ((dims && dims.length === 3) ? '' : params) + '"') : '') + '/>';
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
