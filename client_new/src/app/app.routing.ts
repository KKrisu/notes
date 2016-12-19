import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoteViewComponent } from './note-view/note-view.component';
import { NoteEditComponent } from './note-edit/note-edit.component';
import { TagsComponent } from './tags/tags.component';
import { SearchComponent } from './search/search.component';

import { SaveChangesGuardService } from './note-edit/save-changes-guard.service';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/note/new/edit',
    pathMatch: 'full',
  }, {
    path: 'note/:id',
    component: NoteViewComponent,
  }, {
    path: 'note/:id/edit',
    component: NoteEditComponent,
    canDeactivate: [SaveChangesGuardService],
  }, {
    path: 'tags',
    component: TagsComponent,
  }, {
    path: 'search',
    component: SearchComponent,
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
