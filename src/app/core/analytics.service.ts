import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Product, ProductVariant } from './models/product.model';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly platformId = inject(PLATFORM_ID);

  private push(payload: Record<string, unknown>): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }

  trackViewItem(product: Product, variant?: ProductVariant): void {
    const item = this.mapItem(product, variant);
    this.push({
      event: 'view_item',
      ecommerce: {
        currency: product.currency,
        value: variant?.fromPrice ?? product.pricePromo ?? product.priceRegular,
        items: [item]
      }
    });
  }

  trackAddToCart(product: Product, variant: ProductVariant, quantity: number): void {
    const item = this.mapItem(product, variant);
    this.push({
      event: 'add_to_cart',
      ecommerce: {
        currency: product.currency,
        value: (variant.fromPrice ?? product.priceRegular) * quantity,
        items: [{ ...item, quantity }]
      }
    });
  }

  private mapItem(product: Product, variant?: ProductVariant) {
    return {
      item_id: product.sku,
      item_name: product.name,
      item_variant: variant?.label,
      price: variant?.fromPrice ?? product.pricePromo ?? product.priceRegular,
      quantity: 1
    };
  }
}
