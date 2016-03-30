/*global describe it */
'use strict';

(function () {

    describe('bbcode', function () {

        describe("quote", function () {
            it("renders properly", function () {
                var result = bbcode.render("[QUOTE][url=http://www.example.com]Originally Posted by Author[/url]Test Text[/QUOTE]");
                expect(result).to.equal('<div class="bbcode_quote">Quote:<blockquote><a class="bbcode_link" target="_blank" href="http://www.example.com">Originally Posted by Author</a>Test Text</blockquote></div>');
            });
        });
        describe("quote", function () {
            it("renders properly", function () {
                var result = bbcode.render("[QUOTE=Author]Test Text[/QUOTE]");
                expect(result).to.equal('<div class="bbcode_quote">Author wrote:<blockquote>Test Text</blockquote></div>');
            });
        });
        describe("url with href", function () {
            it("renders properly", function () {
                var result = bbcode.render("[url=http://www.example.com]Originally Posted by Author[/url]");
                expect(result).to.equal('<a class="bbcode_link" target="_blank" href="http://www.example.com">Originally Posted by Author</a>');
            });
        });
        describe("url with quote href", function () {
            it("renders properly", function () {
                var result = bbcode.render("[url=\"http://www.example.com\"]Originally Posted by Author[/url]");
                expect(result).to.equal('<a class="bbcode_link" target="_blank" href="http://www.example.com">Originally Posted by Author</a>');
            });
        });
        describe("img w/alt", function () {
            it("renders properly", function () {
                var result = bbcode.render("[img=alt]url[/img]");
                expect(result).to.equal('<img class="bbcode_image" src="url" alt="alt"/>');
            });
        });
        describe("img no alt", function () {
            it("renders properly", function () {
                var result = bbcode.render("[img]url[/img]");
                expect(result).to.equal('<img class="bbcode_image" src="url"/>');
            });
        });
        describe("img wxh", function () {
            it("renders properly", function () {
                var result = bbcode.render("[img=25x15]url[/img]");
                expect(result).to.equal('<img class="bbcode_image" src="url" width="25" height="15"/>');
            });
        });
        describe("img width=x height=y", function () {
            it("renders properly", function () {
                var result = bbcode.render("[img width=25 height=15]url[/img]");
                expect(result).to.equal('<img class="bbcode_image" src="url" width="25" height="15"/>');
            });
        });
        describe("bold", function () {
            it("renders properly", function () {
                var result = bbcode.render("[b]text[/b]");
                expect(result).to.equal('<strong>text</strong>');
            });
        });
        describe("underline", function () {
            it("renders properly", function () {
                var result = bbcode.render("[u]text[/u]");
                expect(result).to.equal('<span style="text-decoration:underline">text</span>');
            });
        });
        describe("italic", function () {
            it("renders properly", function () {
                var result = bbcode.render("[i]text[/i]");
                expect(result).to.equal('<em>text</em>');
            });
        });
        describe("code", function () {
            it("renders properly", function () {
                var result = bbcode.render("[code]\nleave me alone![/code]");
                expect(result).to.equal('<pre class="bbcode_code">\nleave me alone!</pre>');
            });
        });
        describe("code php", function () {
            it("renders properly", function () {
                var result = bbcode.render("[php]$myvar = 'Hello World!';[/php]");
                expect(result).to.equal('<pre class="bbcode_code_php">$myvar = \'Hello World!\';</pre>');
            });
        });
        describe("mention", function () {
            it("renders properly", function () {
                var result = bbcode.render("[MENTION]Princess Zelda[/MENTION]");
                expect(result).to.equal('<span class="bbcode_mention">@Princess Zelda</span>');
            });
        });
        describe("mention with id", function () {
            it("renders properly", function () {
                var result = bbcode.render("[MENTION=12345]Princess Zelda[/MENTION]");
                expect(result).to.equal('<span class="bbcode_mention" data-mention-id="12345">@Princess Zelda</span>');
            });
        });
        describe("mention without prefix", function () {
            it("renders properly", function () {
                var result = bbcode.render("[MENTION=12345]Princess Zelda[/MENTION]", {mentionPrefix: ''});
                expect(result).to.equal('<span class="bbcode_mention" data-mention-id="12345">Princess Zelda</span>');
            });
        });
        describe("html", function () {
            it("renders properly", function () {
                var result = bbcode.render('[HTML]<img src="image.gif" alt="image"/><a href="testing.html" target="_blank">Testing</a>[/HTML]');
                expect(result).to.equal('<img src="image.gif" alt="image"/><a href="testing.html" target="_blank">Testing</a>');
            });
        });
        describe("simple list", function () {
            it("renders properly", function () {
                var result = bbcode.render('[list][*]Link [*]Zelda [*]Sheik [/list]');
                expect(result).to.equal('<ul class="bbcode_list"><li>Link</li><li>Zelda</li><li>Sheik</li></ul>');
            });
        });
        describe("default to simple list on bad param", function () {
            it("renders properly", function () {
                var result = bbcode.render('[list=Z][*]Link [*]Zelda [*]Sheik [/list]');
                expect(result).to.equal('<ul class="bbcode_list"><li>Link</li><li>Zelda</li><li>Sheik</li></ul>');
            });
        });
        describe("numeric list", function () {
            it("renders properly", function () {
                var result = bbcode.render('[list=1][*]Link [*]Zelda [*]Sheik [/list]');
                expect(result).to.equal('<ol class="bbcode_list_numeric"><li>Link</li><li>Zelda</li><li>Sheik</li></ol>');
            });
        });
        describe("alpha upper list", function () {
            it("renders properly", function () {
                var result = bbcode.render('[list=A][*]Link [*]Zelda [*]Sheik [/list]');
                expect(result).to.equal('<ol class="bbcode_list_alpha"><li>Link</li><li>Zelda</li><li>Sheik</li></ol>');
            });
        });
        describe("alpha lower list", function () {
            it("renders properly", function () {
                var result = bbcode.render('[list=a][*]Link [*]Zelda [*]Sheik [/list]');
                expect(result).to.equal('<ol class="bbcode_list_alpha_lower"><li>Link</li><li>Zelda</li><li>Sheik</li></ol>');
            });
        });
        describe("indent", function () {
            it("renders properly", function () {
                var result = bbcode.render('[INDENT]block me[/INDENT]');
                expect(result).to.equal('<blockquote>block me</blockquote>');
            });
        });
    });
})();
