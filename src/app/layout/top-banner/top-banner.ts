import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-top-banner',
  template: `
    <div class="banner" role="region" aria-label="Promoción">
      <p>Es un hecho establecido hace demasiado tiempo que un lector.</p>
    </div>
  `,
  styleUrl: './top-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopBanner {}
