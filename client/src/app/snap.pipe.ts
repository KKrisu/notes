import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snap'
})
export class SnapPipe implements PipeTransform {

  transform(input: string): string {
    let transformed = input.split('\n', 1)[0];

    if (transformed.length < input.length) {
      transformed += '...';
    }

    return transformed;
  }

}
