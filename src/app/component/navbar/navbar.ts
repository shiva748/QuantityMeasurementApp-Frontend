import {ChangeDetectionStrategy, Component, signal, effect, inject, PLATFORM_ID, ElementRef, viewChild} from '@angular/core';
import {isPlatformBrowser, DOCUMENT} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {Login} from '../login/login';
import { Signup } from '../signup/signup';
import { Auth } from '../../service/auth';
import { RouterLink } from "@angular/router";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'navbar',
  imports: [MatIconModule, Login, Signup, RouterLink],
  templateUrl: './navbar.html',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class Navbar {
  authstore = inject(Auth);
  isMobileMenuOpen = signal(false);
  isProfileDropdownOpen = signal(false);

  isLoginOpen = signal(false);
  isSignupOpen = signal(false);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  profileDropdown = viewChild<ElementRef>('profileDropdown');

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        if (this.isLoginOpen() || this.isSignupOpen()) {
          this.document.body.style.overflow = 'hidden';
        } else {
          this.document.body.style.overflow = '';
        }
      }
    });
  }

  onDocumentClick(event: MouseEvent) {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const dropdown = this.profileDropdown();
    if (!dropdown || !this.isProfileDropdownOpen()) return;

    const target = event.target as HTMLElement;
    const clickedInsideDropdown = dropdown.nativeElement.contains(target);
    
    if (!clickedInsideDropdown) {
      this.isProfileDropdownOpen.set(false);
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen.update(v => !v);
  }

  openLogin() {
    this.isSignupOpen.set(false);
    this.isLoginOpen.set(true);
    this.isMobileMenuOpen.set(false);
  }

  openSignup() {
    this.isLoginOpen.set(false);
    this.isSignupOpen.set(true);
    this.isMobileMenuOpen.set(false);
  }

  closeModals() {
    this.isLoginOpen.set(false);
    this.isSignupOpen.set(false);
  }
}
