import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

type ThemeType = 'light' | 'dark' | 'system';
type ThemeKey = 'light' | 'dark';

interface ThemeColors {
  name: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  light: string;
  medium: string;
  dark: string;
}

type ThemeMap = {
  light: ThemeColors;
  dark: ThemeColors;
};

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app_theme';
  private currentTheme: ThemeType = 'system';
  private themeSubject = new BehaviorSubject<ThemeType>(this.currentTheme);
  private currentColors: ThemeColors;
  private colorsSubject: BehaviorSubject<ThemeColors>;
  private readonly themeColors: ThemeMap;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Initialize default colors
    this.themeColors = {
      light: this.getLightThemeColors(),
      dark: this.getDarkThemeColors()
    };
    this.currentColors = this.getDefaultThemeColors();
    this.colorsSubject = new BehaviorSubject<ThemeColors>(this.currentColors);

    // Set up system theme change listener
    if (this.isBrowser) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.currentTheme === 'system') {
          this.applyTheme('system');
        }
      });
    }
  }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Initialize the application theme
   * Should be called during app initialization
   */
  public initializeTheme(): Promise<void> {
    return new Promise((resolve) => {
      if (this.isBrowser) {
        try {
          const savedTheme = localStorage.getItem(this.THEME_KEY) as ThemeType;
          if (savedTheme) {
            this.setTheme(savedTheme, false);
          }
        } catch (e) {
          console.warn('Failed to load theme from localStorage', e);
        }
      }
      resolve();
    });
  }

  /**
   * Set the current theme
   * @param theme Theme to apply
   * @param savePreference Whether to save the preference to localStorage
   */
  public setTheme(theme: ThemeType, savePreference = true): void {
    if (this.currentTheme === theme) {
      return;
    }
    
    this.currentTheme = theme;
    this.themeSubject.next(theme);
    
    if (savePreference && this.isBrowser) {
      try {
        localStorage.setItem(this.THEME_KEY, theme);
      } catch (e) {
        console.warn('Failed to save theme preference', e);
      }
    }
    
    this.applyTheme(theme);
  }

  /**
   * Toggle to the next theme in sequence: light -> dark -> system -> light -> ...
   */
  public toggleTheme(): void {
    const themes: ThemeType[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }

  /**
   * Apply the specified theme to the document
   * @param theme Theme to apply
   */
  private applyTheme(theme: ThemeType): void {
    if (!this.isBrowser) {
      return;
    }
    
    // Determine which theme to apply
    const themeToApply: ThemeKey = theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : theme as ThemeKey;
    
    // Update current theme colors
    this.currentColors = { ...this.themeColors[themeToApply] };
    this.colorsSubject.next(this.currentColors);
    
    // Apply theme class to document body
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(themeToApply);
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', this.currentColors.primary);
    }
  }

  /**
   * Get the current theme
   */
  public getCurrentTheme(): ThemeType {
    return this.currentTheme;
  }

  /**
   * Get current theme colors
   */
  public getCurrentColors(): ThemeColors {
    return { ...this.currentColors };
  }

  /**
   * Observable for theme changes
   */
  public themeChanges(): Observable<ThemeType> {
    return this.themeSubject.asObservable().pipe(distinctUntilChanged());
  }

  /**
   * Observable for color changes
   */
  public colorsChanges(): Observable<ThemeColors> {
    return this.colorsSubject.asObservable().pipe(distinctUntilChanged());
  }

  /**
   * Get light theme colors
   */
  private getLightThemeColors(): ThemeColors {
    return {
      name: 'light',
      primary: '#3880ff',
      secondary: '#3dc2ff',
      success: '#2dd36f',
      warning: '#ffc409',
      danger: '#eb445a',
      light: '#f4f5f8',
      medium: '#92949c',
      dark: '#222428'
    };
  }

  /**
   * Get dark theme colors
   */
  private getDarkThemeColors(): ThemeColors {
    return {
      name: 'dark',
      primary: '#428cff',
      secondary: '#50c8ff',
      success: '#2fdf75',
      warning: '#ffd534',
      danger: '#ff4961',
      light: '#f4f5f8',
      medium: '#989aa2',
      dark: '#222428'
    };
  }

  /**
   * Get default theme colors (light theme by default)
   */
  private getDefaultThemeColors(): ThemeColors {
    return this.getLightThemeColors();
  }
}
