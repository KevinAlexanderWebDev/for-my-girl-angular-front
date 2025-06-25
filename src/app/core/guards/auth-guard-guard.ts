import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private allowedUsers = [
    { username: 'Kevin', password: '1234' },
    { username: 'Isis Alejandra', password: '1234' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Solo accede a localStorage si es el browser
    if (isPlatformBrowser(this.platformId)) {
      const authState = localStorage.getItem('isAuthenticated');
      this.isAuthenticated = authState === 'true';
    }
  }

  login(username: string, password: string): boolean {
    const validUser = this.allowedUsers.find(
      u => u.username === username && u.password === password
    );

    this.isAuthenticated = !!validUser;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('isAuthenticated', String(this.isAuthenticated));
    }
    return this.isAuthenticated;
  }

  logout(): void {
    this.isAuthenticated = false;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('isAuthenticated');
    }
  }

  get loggedIn(): boolean {
    return this.isAuthenticated;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.loggedIn) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
