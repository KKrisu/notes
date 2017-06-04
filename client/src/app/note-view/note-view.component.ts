import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ApiService } from '../api.service';
import { Statuses } from '../statuses';
import { Note } from '../note';

@Component({
    selector: 'note-view',
    templateUrl: './note-view.component.html',
    styleUrls: ['./note-view.component.css']
})
export class NoteViewComponent implements OnInit {

    note: Note;

    statuses = new Statuses();

    constructor(
         private apiService: ApiService,
         private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            let id = params['id'];

            id = parseInt(params['id'], 10);
            this.apiService.getItem('posts', id).then((note: Note) => {
                this.note = note;
            });
        });
    }

    updateImportance(newValue: number) {
        this.apiService.updateImportance(this.note.id, newValue)
            .then(() => {
                this.note.important = newValue;
            });
    };

}
