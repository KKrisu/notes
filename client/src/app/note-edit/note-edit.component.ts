import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';

import { AceEditorComponent } from 'ng2-ace-editor';
import { Observable } from 'rxjs/Observable';

import { SaveChangesGuardService } from './save-changes-guard.service';
import { ApiService } from '../api.service';
import { Note } from '../note';
import { Tag } from '../tag';
import { Statuses } from '../statuses';

type paramId = 'new' | number;

@Component({
    selector: 'note-edit',
    templateUrl: './note-edit.component.html',
    styleUrls: ['./note-edit.component.less'],
})
export class NoteEditComponent implements OnInit, AfterViewInit {

    private currentId: paramId;
    private note: Note;
    private tags: Tag[];
    private selectedTags: Set<number> = new Set();
    private statuses = (new Statuses()).note;
    private editorText: string = '';

    @ViewChild('editor', {read: AceEditorComponent})
    editor: AceEditorComponent;

    get statusesKeys(): number[] {
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
        let getTagsPromise: Promise<Tag[]> = this.apiService.getItem('tags');

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

    ngAfterViewInit() {
        // This is done with sequence checking every 100ms, because
        // editor is sometimes not initialized with delay
        const editorReady$ = new Observable((observer) => {
            function checkEditor() {
                if (!this.editor) {
                    setTimeout(checkEditor.bind(this), 100);
                } else {
                    observer.complete();
                }
            }

            checkEditor.apply(this);
        });

        editorReady$.subscribe(null, null, () => {
            const aceEditor = this.editor.getEditor();
            aceEditor.setOptions({
                maxLines: Infinity,
            });
            aceEditor.$blockScrolling = Infinity;
            aceEditor.getSession().setUseWrapMode(true);
        });
    }

    onChange(body: string) {
        this.note.body = body;
        this.saveChangesGuard.activate();
    }

    tagChecked(event: HTMLInputElement, tagId: number) {
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
        })).then((data: {id: number}) => {
            if (this.currentId === 'new') {
                this.router.navigate([`/note`, data.id]);
            } else {
                this.snackBar.open('Note updated successfully.', 'Close');
            }
            this.saveChangesGuard.deactivate();
        });
    }

}
