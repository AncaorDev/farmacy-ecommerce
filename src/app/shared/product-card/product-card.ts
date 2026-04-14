import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { CartStore } from '../../core/stores/cart.store';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCard {
  @Input({ required: true }) product!: Product;
  @Input() mode: 'grid' | 'carousel' = 'grid';

  private readonly cart = inject(CartStore);

  protected readonly quantity = computed(() => {
    const _lines = this.cart.linesReadonly();
    const v = this.product?.variants?.[0];
    if (!v) {
      return 0;
    }
    return this.cart.getQuantity(this.product.id, v.id);
  });

  protected add(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const v = this.product.variants[0];
    if (v) {
      this.cart.addItem({ product: this.product, variant: v, quantity: 1 });
    }
  }

  protected increase(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const v = this.product.variants[0];
    if (v) {
      this.cart.increaseItem(this.product.id, v.id, 1);
    }
  }

  protected decrease(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const v = this.product.variants[0];
    if (v) {
      this.cart.decreaseItem(this.product.id, v.id, 1);
    }
  }
}
