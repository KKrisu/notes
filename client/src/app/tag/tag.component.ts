import { Component, OnInit, Input } from '@angular/core';
import { MdSnackBar } from '@angular/material';

import { ApiService } from '../api.service';

import { Tag } from '../tag';

@Component({
    selector: 'tag',
    templateUrl: './tag.component.html',
    styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {

    @Input() tag: Tag;

    mode: string = 'view';
    working: boolean = false;

    constructor(
        public api: ApiService,
        private snackBar: MdSnackBar,
    ) { }

    ngOnInit() {
        if (!this.tag.id) {
            this.mode = 'edit';
        }
    }

    onSubmit() {
        this.working = true;
        this.api
            // should be updateItem, but API is not prepared
            // to handle put on tags (using post instead)
            .createItem('tags', this.tag)
            .then((result) => {
                this.mode = 'view';
                this.working = false;
                this.snackBar.open('Tag saved successfully', 'Close');
            });
    }

}
