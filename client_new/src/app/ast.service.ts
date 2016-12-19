import { Injectable } from '@angular/core';

@Injectable()
export class AstService {

    markdownAstParser: any;

    constructor() {
        this.markdownAstParser = require(
            '../../node_modules/markdown-to-ast/lib/markdown/markdown-parser'
        ).parse;
    }

    getAst(markdown: string): any {
        const ast = this.markdownAstParser(markdown);
        const rawAst = this.formatAstChildren(ast.children);
        const formatted = this.organizeByHeaders(rawAst);
        return formatted;
    };

    // Picks only useful part of ast items
    private formatAstChildren(children: any): any {
        return children.map((item) => {
            var formatted: any = {
                type: item.type,
                depth: item.depth,
                raw: item.raw,
            };

            if (item.children) {
                formatted.children = this.formatAstChildren(item.children);
            }

            return formatted;
        });
    }

    private organizeByHeaders(items: any[]): any {
        let currentHeaderDepth = 0;
        let currentItem;
        let formatted = [];
        items.forEach((item) => {

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

        formatted.forEach((item) => {
            if (item.subitems) {
                item.subitems = this.organizeByHeaders(item.subitems);
            }
        });

        return formatted;
    }
}
