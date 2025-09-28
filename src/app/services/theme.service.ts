import { DOCUMENT } from '@angular/common';
import { inject, Inject, Injectable, signal } from '@angular/core';
import { Theme } from '../enums/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly _document = inject(DOCUMENT);
  readonly currentTheme = signal<Theme>(Theme.Light);
  
  constructor() {
    this.setTheme(this.getThemeFromLocalStorage());
  }

  toggleTheme(): void {
    if (this.currentTheme() === Theme.Light) {
      this.setTheme(Theme.Dark);
    } else {
      this.setTheme(Theme.Light);
    }
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    if (theme === Theme.Dark) {
      this._document.documentElement.classList.add('dark-mode');
    } else {
      this._document.documentElement.classList.remove('dark-mode');
    }
    this.setThemeInLocalStorage(theme);
  }

  setThemeInLocalStorage(theme: Theme): void {
    localStorage.setItem('theme', theme);
  }

  getThemeFromLocalStorage(): Theme {
    return localStorage.getItem('theme') as Theme ?? Theme.Light;
  }
}
