import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { MdSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { Note } from './note';

@Injectable()
export class ApiService {

    private apiUrl: string = '/api/v1/';

    private commonHeaders = {
        'Content-Type': 'application/json',
    };

    constructor(
        private http: Http,
        private snackBar: MdSnackBar,
    ) { }

    private handleError(error: any) {
        console.error(`Api error occured`, error);
        this.snackBar.open('Api error occured', 'Close');
        return Promise.reject(error.message || error);
    }

    get(url: string, headers: any = {}): Observable<Response> {
        url = this.apiUrl + url;
        return this.http.get(url, {
            headers: new Headers(
                Object.assign(this.commonHeaders, headers)
            ),
        });
    }

    put(url: string, body: any, headers: any = {}): Observable<Response> {
        url = this.apiUrl + url;
        return this.http.put(url, JSON.stringify(body), {
            headers: new Headers(
                Object.assign(this.commonHeaders, headers)
            ),
        });
    }

    post(url: string, body: any, headers: any = {}): Observable<Response> {
        url = this.apiUrl + url;
        return this.http.post(url, JSON.stringify(body), {
            headers: new Headers(
                Object.assign(this.commonHeaders, headers)
            ),
        });
    }

    delete(url: string, headers: any = {}): Observable<Response> {
        url = this.apiUrl + url;
        return this.http.delete(url, {
            headers: new Headers(
                Object.assign(this.commonHeaders, headers)
            ),
        });
    }

    patch(url: string, body: any, headers: any = {}): Observable<Response> {
        url = this.apiUrl + url;
        return this.http.patch(url, JSON.stringify(body), {
            headers: new Headers(
                Object.assign(this.commonHeaders, headers)
            ),
        });
    }

    searchNotes(endpoint: string, term: string): Observable<Note[]> {
        const url = `${endpoint}?${term}`;
        return this
            .get(url)
            .map((r: Response) => {
                return r.json() as Note[]
            })
    }

    getItem(endpoint: string, id?: number): Promise<any> {
        const url = `${endpoint}/${id || ''}`;
        return this
            .get(url)
            .toPromise()
            .then((response) => {
                return response.json() as any
            })
            .catch(this.handleError.bind(this));
    }

    updateImportance(noteId: number, newValue: number) {
        const url = `posts/${noteId}`;
        return this
            .patch(url, {
                important: newValue,
            })
            .toPromise()
            .catch(this.handleError.bind(this));
    }

    updateItem(endpoint: string, item: any): Promise<any> {
        const url = `${endpoint}/${item.id}`;
        return this
            .put(url, item)
            .toPromise()
            .then(() => item)
            .catch(this.handleError.bind(this));
    }

    createItem(endpoint: string, item: any): Promise<any> {
        const url = `${endpoint}`;
        return this
            .post(url, item)
            .toPromise()
            .then((response) => {
                const result = response.json();
                return result as any;
            })
            .catch(this.handleError.bind(this));
    }

    deleteItem(endpoint: string, item: any): Promise<any> {
        const url = `${endpoint}/${item.id}`;
        return this
            .delete(url)
            .toPromise()
            .catch(this.handleError.bind(this));
    }
}
