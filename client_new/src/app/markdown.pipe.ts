import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'markdown',
})
export class MarkdownPipe implements PipeTransform {

    md = markdownit({
        linkify: true,
    });

    transform(input: string): any {
        return this.md.render(input);
    }
}
