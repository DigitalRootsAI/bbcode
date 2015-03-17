bbcode.js
=========

bbcode.js is a fairly simple library that will render bbcode to HTML.

Currently, it supports node and client-side JS (both global inclusion + require/AMD).

Installing
----------

npm
```
npm install --save-dev bbcode.js
```

bower
```
bower install --save-dev bbcode
```

Usage
-----

```js
var result = bbcode.render("[url=\"http://www.example.com\"]Originally Posted by Author[/url]");

// Would render:
// <a class="bbcode_link" target="_blank" href="http://www.example.com">Originally Posted by Author</a>
```

```js
var result = bbcode.render("[img width=25 height=15]url[/img]");

// Would render:
// <img class="bbcode_image" src="url" width="25" height="15"/>
```

Building
--------

```
npm install
npm test
```

Compiled output will reside in the dist/ folder.


TODO
----
* add more support for known and/or undocumented tags
* go beyond bbcode and parse bbcode-like data (e.g. quotes)


License
-------
bbcode.js is released under the MIT license.

[bower-repo]: https://github.com/DigitalRootsCRM/bbcode
