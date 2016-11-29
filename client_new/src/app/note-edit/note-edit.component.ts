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
    private selectedTags: Set<number> = new Set();
    private statuses = (new Statuses()).note;
    private editorText: string = '';
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


        getTagsPromise = this.apiService.getItem('tags');

        this.route.params.subscribe((params: Params) => {
            this.saveChangesGuard.deactivate();
            this.currentId = params['id'];
            this.editorText = '';
            this.selectedTags.clear();

            if (this.currentId === 'new') {
                getNotePromise = Promise.resolve(new Note(''));
            } else {
                this.currentId = parseInt(params['id'], 10);
                getNotePromise = this.apiService.getItem('posts', this.currentId);
            }

            Promise.all([getNotePromise, getTagsPromise]).then(([note, tags]) => {
                this.note = note;
                this.editorText = this.note.body;
                this.tags = tags;
                this.note.tags.forEach(tag => this.selectedTags.add(tag.tag_id));
            });
        });

    }

    onChange(body: string) {
        this.note.body = body;
        this.saveChangesGuard.activate();
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
