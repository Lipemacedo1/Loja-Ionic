import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ThemeService, ThemeType } from '../../core/services/theme.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class ThemeToggleComponent implements OnInit {
  currentTheme: ThemeType = 'system';
  isDarkMode = false;
  themeOptions = [
    { value: 'light', label: 'Claro', icon: 'sunny' },
    { value: 'dark', label: 'Escuro', icon: 'moon' },
    { value: 'system', label: 'Sistema', icon: 'contrast' }
  ];

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    const savedTheme = this.themeService.getCurrentTheme();
    if (savedTheme) {
      this.currentTheme = savedTheme;
    }

    this.themeService.themeChanges().subscribe(theme => {
      this.currentTheme = theme;
      this.updateDarkMode();
    });

    this.updateDarkMode();
  }

  setTheme(theme: ThemeType) {
    this.themeService.setTheme(theme);
  }

  private updateDarkMode() {
    if (this.currentTheme === 'system') {
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      this.isDarkMode = this.currentTheme === 'dark';
    }
  }
}
