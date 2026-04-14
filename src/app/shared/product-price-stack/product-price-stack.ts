import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-price-stack',
  imports: [DecimalPipe],
  templateUrl: './product-price-stack.html',
  styleUrl: './product-price-stack.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductPriceStack {
  @Input({ required: true }) product!: Product;
}
