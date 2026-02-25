import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';
import { I18nService } from '../../core/services/i18n.service';
import { Router, RouterModule } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { SearchService, SearchResult } from '../../core/services/search.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.html',
  styleUrls: ['./search.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class Search implements OnInit {
  currentLang!: string;
  isLoading = false;
  searchForm!: FormGroup;
  searchResults: SearchResult[] = [];
  noResults = false;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private viewportScroller: ViewportScroller,
    public translation: TranslationService,
    public i18n: I18nService,
    public searchService: SearchService
  ) {
    this.createForm();
  }
  
  createForm() {
    this.searchForm = this.fb.group({
      query: ['']
    });
  }
  
  async ngOnInit() {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();
    
    // Subscribe to language changes
    this.i18n.currentLang$.subscribe(lang => {
      if (lang !== this.currentLang) {
        this.currentLang = lang;
        // Re-search when language changes if there's a query
        const query = this.searchForm.get('query')?.value;
        if (query && query.trim() !== '') {
          this.performSearch();
        }
      }
    });
    
    // Automatic search with debounce
    this.searchForm.get('query')?.valueChanges
      .pipe(
        debounceTime(300), // Wait 300ms after last keystroke
        distinctUntilChanged(), // Skip if value hasn't changed
        switchMap(query => {
          // Show loading only for non-empty queries
          if (query && query.trim() !== '') {
            this.isLoading = true;
          }
          return this.searchService.search(query);
        })
      )
      .subscribe({
        next: (results) => {
          this.searchResults = results;
          const query = this.searchForm.get('query')?.value;
          this.noResults = results.length === 0 && query && query.trim() !== '';
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Search error:', error);
          this.searchResults = [];
          this.noResults = false;
          this.isLoading = false;
        }
      });
  }
  
  /**
   * Извършва търсене чрез SearchService (викано при смяна на език)
   */
  performSearch() {
    const query = this.searchForm.get('query')?.value;
    if (!query || query.trim() === '') {
      this.searchResults = [];
      this.noResults = false;
      return;
    }
    
    this.isLoading = true;
    
    this.searchService.search(query).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.noResults = results.length === 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.searchResults = [];
        this.noResults = false;
        this.isLoading = false;
      }
    });
  }

  /**
   * Navigate to search result with support for anchor links
   * Handles both regular links (/about) and anchor links (/about#achievements)
   */
  navigateToResult(link: string) {
    console.log('🔗 navigateToResult called with link:', link);
    
    // Check if link contains anchor (#)
    if (link.includes('#')) {
      const [path, anchor] = link.split('#');
      
      console.log('📍 Navigating to:', path, 'with anchor:', anchor);
      
      // Navigate to the page first
      this.router.navigate([path]).then((success) => {
        console.log('✅ Navigation success:', success);
        
        // Wait for page to fully load and render before scrolling
        // Try multiple times with increasing delays
        const tryScroll = (attempt: number = 0) => {
          const element = document.getElementById(anchor);
          console.log(`🔍 Scroll attempt ${attempt + 1}, element found:`, !!element);
          
          if (element) {
            // Element found - scroll to it
            console.log('✨ Scrolling to element:', anchor);
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else if (attempt < 10) {
            // Element not found yet - try again (increased to 10 attempts)
            setTimeout(() => tryScroll(attempt + 1), 300);
          } else {
            console.warn(`❌ Could not find element with id: ${anchor} after ${attempt + 1} attempts`);
          }
        };
        
        // Start trying after initial delay
        setTimeout(() => tryScroll(), 800);
      }).catch(error => {
        console.error('❌ Navigation error:', error);
      });
    } else {
      // Regular navigation without anchor
      console.log('📄 Regular navigation to:', link);
      this.router.navigate([link]);
    }
  }
}