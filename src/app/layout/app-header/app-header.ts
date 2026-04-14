import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartStore } from '../../core/stores/cart.store';

@Component({
  selector: 'app-app-header',
  imports: [RouterLink],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeader {
  protected readonly cart = inject(CartStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly searchTerm = signal('');

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      this.searchTerm.set((params.get('q') ?? '').trim());
    });
  }

  protected onSearchInput(value: string): void {
    this.searchTerm.set(value);
  }

  protected submitSearch(): void {
    const q = this.searchTerm().trim();
    void this.router.navigate(['/'], {
      queryParams: q ? { q } : {},
      queryParamsHandling: ''
    });
  }
}
