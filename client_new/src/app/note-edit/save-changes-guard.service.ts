import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MdDialog } from '@angular/material';

import { NoteEditComponent } from './note-edit.component';
import { SaveNoteChangesDialogComponent } from './save-note-changes-dialog/save-note-changes-dialog.component';

@Injectable()
export class SaveChangesGuardService implements CanDeactivate<NoteEditComponent> {

    private readonly msg: string = 'Note is not saved. Are you sure you want to discard these';
    private pristine: boolean = true;

    canDeactivate(component: NoteEditComponent) {
        if (this.pristine) {
            return Promise.resolve(true);
        }
        return this.dialog
            .open(SaveNoteChangesDialogComponent)
            .afterClosed()
            .toPromise()
            .then((result) => {
                if (result === 'redirect') {
                    this.deactivate();
                    return true;
                } else if (result === 'stay') {
                    return false;
                }
            });
    }

    constructor(
        public dialog: MdDialog,
    ) {
        window.onbeforeunload = (e) => {
            if (!this.pristine) {
                return this.msg;
            }
        };
    }

    activate() {
        this.pristine = false;
    }

    deactivate() {
        this.pristine = true;
    }

}
