import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-app-footer',
  templateUrl: './app-footer.html',
  styleUrl: './app-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppFooter {}
