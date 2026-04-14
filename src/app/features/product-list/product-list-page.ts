import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { Product } from '../../core/models/product.model';
import { ProductStore } from '../../core/stores/product.store';
import { ProductCard } from '../../shared/product-card/product-card';
import { LoadingState } from '../../shared/loading-state/loading-state';
import { ErrorState } from '../../shared/error-state/error-state';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [ProductCard, LoadingState, ErrorState],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListPage {
  private readonly productStore = inject(ProductStore);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly products = signal<Product[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const source = this.products();
    if (!term) {
      return source;
    }
    return source.filter((p) => {
      const haystack = [p.name, p.shortDescription, p.sku, p.slug].join(' ').toLowerCase();
      return haystack.includes(term);
    });
  });

  constructor() {
    this.seo.setListingPage();
    this.route.queryParamMap.subscribe((params) => {
      this.searchTerm.set((params.get('q') ?? '').trim());
    });
    this.load();
  }

  protected retry(): void {
    this.load();
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const list = await this.productStore.getProducts();
      this.products.set(list);
      this.loading.set(false);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al cargar';
      this.error.set(message);
      this.loading.set(false);
    }
  }
}
