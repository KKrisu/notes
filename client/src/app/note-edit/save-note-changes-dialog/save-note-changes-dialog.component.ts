import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
    selector: 'app-save-note-changes-dialog',
    templateUrl: './save-note-changes-dialog.component.html',
    styleUrls: ['./save-note-changes-dialog.component.css']
})
export class SaveNoteChangesDialogComponent {

    constructor(
        public dialogRef: MdDialogRef<SaveNoteChangesDialogComponent>,
    ) { }

}
