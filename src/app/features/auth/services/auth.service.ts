import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { APILoginResponse, AuthStatus, User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _httpClient = inject(HttpClient);
  private _router = inject(Router);

  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));
  private _authStatus = signal<AuthStatus>('checking');


  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') {
      return 'checking';
    } else if (this._user() && this._token()) {
      return 'authenticated';
    } else {
      return 'not-authenticated';
    }
  });

  checkStatusResource = rxResource({
    params: () => ({}),
    stream: () => this.checkStatus(),
    defaultValue: false
  })

  user = computed(this._user);
  isAdminUser = computed(() => this.user()?.roles.includes('admin'));
  token = computed(this._token);


  login(email: string, password: string) {
    return this._httpClient.post<APILoginResponse>(`${environment.apiBaseUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
        }),
        catchError(error => {
          this.logout();
          throw error;
        })
      );
  }

  register(email: string, password: string, fullName: string) {
    return this._httpClient.post<APILoginResponse>(`${environment.apiBaseUrl}/auth/register`, { email, password, fullName })
  };

  checkStatus() {
    if (!this.token()) {
      this._authStatus.set('not-authenticated');
      return of(false);
    }

    return this._httpClient.get<APILoginResponse>(`${environment.apiBaseUrl}/auth/check-status`).pipe(
      map(res => this.handleAuthSuccess(res)),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  logout(redirect = false) {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
    if (redirect) {
      this._router.navigate(['/auth/login']);
    }
  }

  private handleAuthSuccess({ user, token }: APILoginResponse) {
    this._user.set(user);
    this._token.set(token);
    this._authStatus.set('authenticated');
    localStorage.setItem('token', token);
    return true;
  }


}
