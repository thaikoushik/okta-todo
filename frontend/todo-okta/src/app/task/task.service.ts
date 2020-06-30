import { Injectable } from '@angular/core';
import { task } from './models/task';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, catchError } from 'rxjs/operators';
import { OktaAuthService } from '@okta/okta-angular';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  Url: string = 'http://localhost:3000';
  idToken: string;
  accessToken: string;
  userClaims: any;
  username: string;
  constructor(
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private oktaAuthSvc: OktaAuthService
  ) {
    this.oktaAuthSvc.getIdToken().then(p => {
      this.idToken = p;
    });
    this.oktaAuthSvc.getAccessToken().then(p => {
      this.accessToken = p;
    });
  }

  addTask(task1: task): Observable<any> {
    let _headers = new HttpHeaders();
    _headers = _headers.append('Authorization', `Bearer ${this.accessToken}`);
    return this.httpClient
      .post(this.Url + '/addtask', task1, { headers: _headers })
      .pipe(
        catchError(err => {
          this.snackBar.open('failed with error: ' + err.toString());
          return of({});
        })
      );
  }

  removeTasks(tasks: Array<task>): Observable<any> {
    let _headers = new HttpHeaders();
    _headers = _headers.append('Authorization', `Bearer ${this.accessToken}`);
    let removeTasks = [];
    tasks.forEach((task) => {
      removeTasks.push(task.text);
    });
    return this.httpClient
      .post(this.Url + '/removetask', removeTasks,  {headers: _headers})
      .pipe(
        catchError(err => {
          console.log(err);
          return of([]);
        })
      );
  }

  get(): Observable<Array<string>> {
    let _headers = new HttpHeaders();
    _headers = _headers.append('Authorization', `Bearer ${this.accessToken}`);
    return this.httpClient
      .get<Array<string>>(this.Url, { headers: _headers })
      .pipe(
        catchError(err => {
          console.log(err);
          this.snackBar.open('failed with error: ' + err.toString());
          return of([]);
        })
      );
  }
}
