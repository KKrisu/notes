import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';

import { SaveChangesGuardService } from './save-changes-guard.service';
import { ApiService } from '../api.service';
import { Note } from '../note';
import { Tag } from '../tag';
import { Statuses } from '../statuses';

@Component({
    selector: 'note-edit',
    templateUrl: './note-edit.component.html',
    styleUrls: ['./note-edit.component.less'],
})
export class NoteEditComponent implements OnInit {

    private currentId: any;
    private note: Note;
    private tags: Tag[];
    private selectedTags = new Set();
    private statuses = (new Statuses()).note;
    @ViewChild('noteForm') private noteForm: NgForm;

    get statusesKeys():number[] {
        return Object.keys(this.statuses).map(item => parseInt(item, 10));
    }

    constructor(
         private apiService: ApiService,
         private route: ActivatedRoute,
         private router: Router,
         private snackBar: MdSnackBar,
         private saveChangesGuard: SaveChangesGuardService,
    ) { }

    ngOnInit() {
        let getNotePromise: Promise<Note>;
        let getTagsPromise: Promise<Tag[]>;

        this.saveChangesGuard.deactivate();

        this.route.params.forEach((params: Params) => {
            this.currentId = params['id'];

            if (this.currentId === 'new') {
                getNotePromise = Promise.resolve(new Note(''));
            } else {
                this.currentId = parseInt(params['id'], 10);
                getNotePromise = this.apiService.getItem('posts', this.currentId);
            }
        });

        getTagsPromise = this.apiService.getItem('tags');

        Promise.all([getNotePromise, getTagsPromise]).then(([note, tags]) => {
            this.note = note;
            this.tags = tags;
            this.note.tags.forEach(tag => this.selectedTags.add(tag.tag_id));

            // we can access form after timeout, because it's under *ngIf
            setTimeout(() => {
                this.noteForm.valueChanges.subscribe((formValues) => {
                    this.saveChangesGuard.activate();
                });
            });
        });
    }

    tagChecked(event: any, tagId: number) {
        this.saveChangesGuard.activate();
        if (event.checked) {
            this.selectedTags.add(tagId);
        } else {
            this.selectedTags.delete(tagId);
        }
    }

    saveNote(form) {
        this.apiService.createItem('posts', Object.assign({}, this.note, {
            tags: Array.from(this.selectedTags),
        })).then((data: any) => {
            if (this.currentId === 'new') {
                this.router.navigate([`/note`, data.id]);
            } else {
                this.snackBar.open('Note updated successfully.', 'Close');
            }
            this.saveChangesGuard.deactivate();
        });
    }

}
