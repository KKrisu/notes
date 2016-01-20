var markdownAstParser = require(
    '../../node_modules/markdown-to-ast/lib/markdown/markdown-parser.js'
).parse;

module.exports = function () {
    'use strict';

    this.getAst = function(markdown) {
        var ast = markdownAstParser(markdown);
        var rawAst = formatAstChildren(ast.children);
        var formatted = organizeByHeaders(rawAst);
        return formatted;
    };

    // Picks only useful part of ast items
    function formatAstChildren(children) {
        return children.map(function(item) {
            var formatted = {
                type: item.type,
                depth: item.depth,
                raw: item.raw,
            };

            if (item.children) {
                formatted.children = formatAstChildren(item.children);
            }

            return formatted;
        });
    }

    function organizeByHeaders(items) {
        var currentHeaderDepth = 0;
        var currentItem;
        var formatted = [];
        items.forEach(function(item) {

            // pushing directly items before first Header
            if (currentHeaderDepth === 0 && item.type !== 'Header' && !currentItem) {
                formatted.push(item);
                return;
            }

            if (item.type === 'Header' && (currentHeaderDepth === 0 || item.depth <= currentHeaderDepth)) {
                currentHeaderDepth = item.depth;
                formatted.push(item);
                currentItem = item;
            } else {
                if (!currentItem.subitems) {
                    currentItem.subitems = [];
                }
                currentItem.subitems.push(item);
            }
        });

        formatted.forEach(function(item) {
            if (item.subitems) {
                item.subitems = organizeByHeaders(item.subitems);
            }
        });

        return formatted;
    }
};
