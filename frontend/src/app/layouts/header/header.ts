// import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
// import { Router } from '@angular/router';
// import { TranslationService } from '../../core/services/translation.service';
// import { I18nService } from '../../core/services/i18n.service';

// @Component({
//   selector: 'app-header',
//   standalone: false,
//   templateUrl: './header.html',
//   styleUrl: './header.css',
// })
// export class Header implements OnInit {
//   dropdownOpen = false;
//   currentLang!: string;

//   constructor(public translation: TranslationService, public i18n: I18nService) {}

//   async ngOnInit() {
//     this.currentLang = this.i18n.getCurrentLanguage();
//     await this.translation.loadTranslations();
//   }

//   toggleDropdown() {
//     this.dropdownOpen = !this.dropdownOpen;
//   }

//   changeLanguage(lang: string) {
//     this.i18n.setLanguage(lang);
//     this.currentLang = lang;
//     setTimeout(() => {
//       this.dropdownOpen = false;
//     }, 150);
//     this.translation.loadTranslations();
//   }

//   @HostListener('document:click', ['$event'])
//   onDocumentClick(event: MouseEvent) {
//     const target = event.target as HTMLElement;
//     const clickedInside = target.closest('.language-switcher');
//     if (!clickedInside) {
//       this.dropdownOpen = false;
//     }
//   }
// }

import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { I18nService } from '../../core/services/i18n.service';
import { AuthService, User } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  @ViewChild('navbarNav', { static: false }) navbarNav!: ElementRef;
  @ViewChild('burgerIcon', { static: false }) burgerIcon!: ElementRef;

  dropdownOpen = false;
  currentLang!: string;

  isSticky = false;
  isMobileMenuOpen = false;

  mobileDropdowns: { [key: string]: boolean } = {};
  mobileLangDropdownOpen = false;
  
  isLoggedIn = false;
  currentUser: User | null = null;
  private authSubscription: Subscription | null = null;

  constructor(
    public translation: TranslationService,
    public i18n: I18nService,
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();

    this.mobileDropdowns = {
      platforms: false,
    };
    
    // Subscribe to auth state
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }
  
  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    
    // Clean up any event listeners if needed
    document.body.style.overflow = '';
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
      }
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  changeLanguage(lang: string) {
    this.i18n.setLanguage(lang);
    this.currentLang = lang;
    setTimeout(() => {
      this.dropdownOpen = false;
      this.mobileLangDropdownOpen = false;
    }, 150);
    this.translation.loadTranslations();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.language-switcher');
    if (!clickedInside) {
      this.dropdownOpen = false;
    }
  }

  // Already defined above

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isSticky = window.pageYOffset > 50;
  }

  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: Event) {
  //   const target = event.target as HTMLElement;

  //   // Close desktop language dropdown if clicked outside
  //   const langSwitcher = document.querySelector('.language-switcher');
  //   if (langSwitcher && !langSwitcher.contains(target)) {
  //     this.dropdownOpen = false;
  //   }

  //   // Close mobile language dropdown if clicked outside
  //   const mobileLangSwitcher = document.querySelector('.mobile-language');
  //   if (mobileLangSwitcher && !mobileLangSwitcher.contains(target)) {
  //     this.mobileLangDropdownOpen = false;
  //   }
  // }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      this.closeMobileDropdowns();
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
    this.closeMobileDropdowns();
  }

  closeMobileDropdowns() {
    this.mobileDropdowns = {
      platforms: false,
    };
    this.mobileLangDropdownOpen = false;
  }

  toggleMobileDropdown(dropdownName: string) {
    // Close all other dropdowns
    Object.keys(this.mobileDropdowns).forEach((key) => {
      if (key !== dropdownName) {
        this.mobileDropdowns[key] = false;
      }
    });

    // Toggle current dropdown
    this.mobileDropdowns[dropdownName] = !this.mobileDropdowns[dropdownName];
  }

  toggleMobileLangDropdown() {
    this.mobileLangDropdownOpen = !this.mobileLangDropdownOpen;
  }

  toggleDesktopLangDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // changeLanguage(lang: string) {
  //   this.currentLang = lang;
  //   this.dropdownOpen = false;
  //   this.mobileLangDropdownOpen = false;

    // Call your translation service method here
    // this.translation.setLanguage(lang);
  // }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.closeMobileMenu();
  }

  onOverlayClick() {
    this.closeMobileMenu();
  }

  getCurrentLangFlag(): string {
    return this.currentLang === 'bg' ? '🇧🇬' : '🇬🇧';
  }

  getCurrentLangText(): string {
    return this.currentLang === 'bg' ? 'Български' : 'English';
  }

  getOtherLangFlag(): string {
    return this.currentLang === 'bg' ? '🇬🇧' : '🇧🇬';
  }

  getOtherLang(): string {
    return this.currentLang === 'bg' ? 'en' : 'bg';
  }
}
