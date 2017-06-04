import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule, MdSnackBar } from '@angular/material'

import { ApiService }  from './api.service';
import { SaveChangesGuardService } from './note-edit/save-changes-guard.service';
import { AstService } from './ast.service';

import { routing } from './app.routing';

import { MarkdownPipe } from './markdown.pipe';
import { SnapPipe } from './snap.pipe';

import { AppComponent } from './app.component';
import { NoteViewComponent } from './note-view/note-view.component';
import { NoteEditComponent } from './note-edit/note-edit.component';
import { SaveNoteChangesDialogComponent } from './note-edit/save-note-changes-dialog/save-note-changes-dialog.component';
import { TagsComponent } from './tags/tags.component';
import { TagComponent } from './tag/tag.component';
import { SearchComponent } from './search/search.component';
import { AstTreeComponent } from './ast-tree/ast-tree.component';

import { AceEditorModule } from 'ng2-ace-editor';

// Modules for ACE editor based on
// https://github.com/thlorenz/brace#can-i-use-it-with-typescript
import 'brace/mode/markdown';
import 'brace/theme/eclipse';

@NgModule({
    declarations: [
        AppComponent,
        NoteViewComponent,
        NoteEditComponent,
        SaveNoteChangesDialogComponent,
        TagsComponent,
        TagComponent,
        SearchComponent,
        AstTreeComponent,
        MarkdownPipe,
        SnapPipe,
    ],
    entryComponents: [
        SaveNoteChangesDialogComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing,
        MaterialModule.forRoot(),
        AceEditorModule,
    ],
    providers: [
        ApiService,
        MdSnackBar,
        SaveChangesGuardService,
        AstService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
