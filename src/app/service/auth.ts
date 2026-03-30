import { Injectable, signal, WritableSignal } from '@angular/core';
import { UserData } from '../model/user.model';
import { Router } from '@angular/router';
import { ApiResponse } from '../model/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private router: Router) {}
  private loggedIn: WritableSignal<boolean> = signal(false);
  private userData: WritableSignal<UserData | null> = signal(null);
  isLoggingOut = signal(false);
  isLoggedIn(): boolean {
    return this.loggedIn();
  }

  getUserData(): UserData | null {
    return this.userData();
  }

  markAsLoggedIn(userData: UserData | null) {
    this.loggedIn.set(true);
    this.userData.set(userData);
  }

  async logout() {
    this.isLoggingOut.set(true);
    try {
      const res = await fetch('/api/auth/session/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      let data: ApiResponse<null> = await res.json();
      if (data.success) {
        this.userData.set(null);
        this.loggedIn.set(false);
        this.router.navigate(['/']);
      }
      console.log(data.message);
    } catch (error) {
      console.error('Error checking session', error);
    } finally {
      this.isLoggingOut.set(false);
    }
  }

  async checkSession() {
    try {
      const res = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      let data: ApiResponse<UserData> = await res.json();
      if (data.success) {
        this.markAsLoggedIn(data.data);
      }
      console.log(data.message);
    } catch (error) {
      console.error('Error checking session', error);
    }
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }
}
