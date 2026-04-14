import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBanner } from '../top-banner/top-banner';
import { AppHeader } from '../app-header/app-header';
import { MainNav } from '../main-nav/main-nav';
import { AppFooter } from '../app-footer/app-footer';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, TopBanner, AppHeader, MainNav, AppFooter],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShell {}
