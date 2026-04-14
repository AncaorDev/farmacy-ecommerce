import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  computed,
  inject,
  signal
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';
import { SeoService } from '../../core/seo.service';
import { AnalyticsService } from '../../core/analytics.service';
import { Product, ProductVariant } from '../../core/models/product.model';
import { ProductStore } from '../../core/stores/product.store';
import { CartStore } from '../../core/stores/cart.store';
import { Breadcrumbs } from '../../shared/breadcrumbs/breadcrumbs';
import { ImageGallery } from '../../shared/image-gallery/image-gallery';
import { ProductPriceStack } from '../../shared/product-price-stack/product-price-stack';
import { ProductAccordion } from '../../shared/product-accordion/product-accordion';
import { ProductCarousel } from '../../shared/product-carousel/product-carousel';
import { LoadingState } from '../../shared/loading-state/loading-state';
import { ErrorState } from '../../shared/error-state/error-state';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [
    Breadcrumbs,
    ImageGallery,
    ProductPriceStack,
    ProductAccordion,
    ProductCarousel,
    LoadingState,
    ErrorState,
    DecimalPipe
  ],
  templateUrl: './product-detail-page.html',
  styleUrl: './product-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly productStore = inject(ProductStore);
  private readonly cart = inject(CartStore);
  private readonly seo = inject(SeoService);
  private readonly analytics = inject(AnalyticsService);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly product = signal<Product | undefined>(undefined);
  protected readonly related = signal<Product[]>([]);

  protected readonly selectedVariantId = signal<string | null>(null);
  protected readonly descExpanded = signal(false);
  protected readonly wish = signal(false);

  protected readonly selectedVariant = computed(() => {
    const p = this.product();
    const id = this.selectedVariantId();
    if (!p?.variants?.length) {
      return undefined;
    }
    return p.variants.find((v) => v.id === id) ?? p.variants[0];
  });

  protected readonly displayImages = computed(() => {
    const p = this.product();
    const v = this.selectedVariant();
    if (!p) {
      return [] as string[];
    }
    if (v?.images?.length) {
      return v.images;
    }
    return p.images;
  });

  private lastViewTracked: string | null = null;

  protected readonly selectedVariantQuantity = computed(() => {
    const _product = this.product();
    const _variant = this.selectedVariant();
    const _lines = this.cart.linesReadonly();
    if (!_product || !_variant) {
      return 0;
    }
    return this.cart.getQuantity(_product.id, _variant.id);
  });

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('slug')),
        filter((slug): slug is string => !!slug)
      )
      .subscribe((slug) => {
        void this.loadBySlug(slug);
      });
  }

  private async loadBySlug(slug: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const product = await this.productStore.getProductBySlug(slug);
      const related = product
        ? await this.productStore.getRelated(product.relatedProductIds)
        : [];
      this.product.set(product);
      this.related.set(related);
      this.loading.set(false);
      if (!product) {
        this.error.set('Producto no encontrado');
        return;
      }
      this.selectedVariantId.set(product.variants[0]?.id ?? null);
      this.seo.setProductPage(
        product.name,
        product.shortDescription,
        product.images[0],
        `/productos/${product.slug}`
      );
      if (this.lastViewTracked !== product.id) {
        this.analytics.trackViewItem(product, product.variants[0]);
        this.lastViewTracked = product.id;
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error';
      this.error.set(message);
      this.loading.set(false);
    }
  }

  protected selectVariant(v: ProductVariant): void {
    this.selectedVariantId.set(v.id);
  }

  protected toggleDesc(): void {
    this.descExpanded.update((v) => !v);
  }

  protected toggleWish(): void {
    this.wish.update((w) => !w);
  }

  protected addToCart(): void {
    const p = this.product();
    const v = this.selectedVariant();
    if (!p || !v) {
      return;
    }
    this.cart.addItem({ product: p, variant: v, quantity: 1 });
    this.analytics.trackAddToCart(p, v, 1);
  }

  protected increaseQuantity(): void {
    const p = this.product();
    const v = this.selectedVariant();
    if (!p || !v) {
      return;
    }
    this.cart.increaseItem(p.id, v.id, 1);
    this.analytics.trackAddToCart(p, v, 1);
  }

  protected decreaseQuantity(): void {
    const p = this.product();
    const v = this.selectedVariant();
    if (!p || !v) {
      return;
    }
    this.cart.decreaseItem(p.id, v.id, 1);
  }

  protected retry(): void {
    if (isPlatformBrowser(this.platformId)) {
      globalThis.location.reload();
    }
  }
}
