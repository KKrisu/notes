import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { AstService } from '../ast.service';

@Component({
    selector: 'ast-tree',
    templateUrl: './ast-tree.component.html',
    styleUrls: ['./ast-tree.component.less']
})
export class AstTreeComponent implements OnInit, OnChanges {

    @Input() markdown: string;

    formattedAst: string = '';

    constructor(
        private astService: AstService,
    ) { }

    ngOnInit() {}

    ngOnChanges(changesObj: any) {
        const data = changesObj.markdown;
        if (data && data.currentValue !== data.previousValue.toString()) {
            if (data.currentValue) {
                this.formattedAst = JSON.stringify(
                    this.astService.getAst(data.currentValue), null, 2
                );
            }
        }
    };

}
