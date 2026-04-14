import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../core/stores/cart.store';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartPage {
  private readonly cart = inject(CartStore);
  private readonly seo = inject(SeoService);

  protected readonly lines = this.cart.linesReadonly;

  protected readonly subtotal = computed(() =>
    this.lines().reduce((acc, line) => acc + line.unitPrice * line.quantity, 0)
  );

  protected readonly total = computed(() => this.subtotal());
  protected readonly totalCard = computed(() => this.total() * 0.985);

  constructor() {
    this.seo.setProductPage(
      'Carrito de compras',
      'Resumen de productos agregados al carrito.',
      '/images/logo.png',
      '/carrito'
    );
  }

  protected increase(productId: string, variantId: string): void {
    this.cart.increaseItem(productId, variantId, 1);
  }

  protected decrease(productId: string, variantId: string): void {
    this.cart.decreaseItem(productId, variantId, 1);
  }

  protected remove(productId: string, variantId: string): void {
    this.cart.removeItem(productId, variantId);
  }
}
