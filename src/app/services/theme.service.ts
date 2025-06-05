import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public readonly currentTheme = signal<Theme>('light');

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.setTheme(this.getThemeFromLocalStorage());
  }

  toggleTheme(): void {
    if (this.currentTheme() === 'light') {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    if (theme === 'dark') {
      this.document.documentElement.classList.add('dark-mode');
    } else {
      this.document.documentElement.classList.remove('dark-mode');
    }
    this.setThemeInLocalStorage(theme);
  }

  setThemeInLocalStorage(theme: Theme): void {
    localStorage.setItem('theme', theme);
  }

  getThemeFromLocalStorage(): Theme {
    return localStorage.getItem('theme') as Theme ?? 'light';
  }
}
