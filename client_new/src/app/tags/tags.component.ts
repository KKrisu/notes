import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';

import { Tag } from '../tag';

@Component({
    selector: 'app-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

    tags: any[];

    constructor(
        private apiService: ApiService,
    ) { }

    ngOnInit() {
        this.apiService.getItem('tags').then((tags) => {
            this.tags = tags;
        });
    }

    addNew() {
        this.tags.push(new Tag(''));
    }

}
