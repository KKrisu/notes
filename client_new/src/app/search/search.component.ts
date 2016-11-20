import { Component, OnInit, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable, BehaviorSubject, Subscription } from 'rxjs';

import { ApiService } from '../api.service';
import { Note } from '../note';

@Component({
    selector: 'notes-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.less'],
    host: {
        '(document:click)': 'documentClick($event)'
    },
})
export class SearchComponent implements OnInit {

    private searchString: string = '';
    private searchTerms = new BehaviorSubject<string>('');
    private searchControl = new FormControl();
    private searchBy: string = 'any';
    private resultsOpen: boolean = false;
    private initialValue: boolean = true;

    private notes: Observable<Note[]>;

    constructor(
        private api: ApiService,
        private _eref: ElementRef,
    ) { }

    ngOnInit() {
        this.notes = this.searchTerms
            .switchMap((term) => {
                return this.api.searchNotes(
                    'posts', `${this.searchBy}=${encodeURIComponent(term)}`
                );
            })
            .catch((error) => {
                return Observable.of<Note[]>([]);
            });

        this.notes.subscribe((values) => {
            if (this.initialValue) {
                this.initialValue = false;
                return;
            }
            this.resultsOpen = true;
        });

        this.searchControl.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe((term) => {
                this.searchString = term;
                this.searchTerms.next(this.searchString);
            });
    }

    refetch() {
        this.searchTerms.next(this.searchString);
    }

    searchByChanged(event) {
        this.searchBy = event.srcElement.value;
        // refetching results with previous searchString
        this.searchTerms.next(this.searchString);
    }

    searchByStatus(status) {
        this.searchBy = 'status';
        this.searchString = status;
        this.searchControl.setValue(this.searchString);
    }

    documentClick(event) {
        // closing search results when user clicks outside
        // solution based on http://stackoverflow.com/a/35713421/630409
        if (!this._eref.nativeElement.contains(event.target)) {
            this.resultsOpen = false;
        }
    }

    // // updates important field of note
    // $scope.updateImportance = function (noteId, importantValue) {
    //     commonMethods.updateImportance(noteId, importantValue).then(function () {
    //         _.find($scope.results, function(item) {
    //             return item.id === noteId;
    //         }).important = importantValue;
    //         updateSearchResults();
    //     }, function (err) {
    //         console.error('updating important field failure', err);
    //     });
    // };
}
