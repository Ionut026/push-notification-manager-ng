import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, UserWithToken } from '../types/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<UserWithToken>;
  public currentUser: Observable<UserWithToken>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserWithToken>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserWithToken {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) : Observable<UserWithToken> {
    return this.http.post<{ user: User, validTo: string, token: string }>(`${environment.apiUrl}Users/login`, { username, password })
      .pipe(map(response => {
        let userWithToken = null;
        // login successful if there's a jwt token in the response
        if (response && response.user && response.token) {
          userWithToken = new UserWithToken(
            response.user.userName,
            response.user.password,
            response.user.role,
            response.token);
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(userWithToken));
          this.currentUserSubject.next(userWithToken);
        }

        return userWithToken;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
