import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, signal } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-product-carousel',
  imports: [ProductCard],
  templateUrl: './product-carousel.html',
  styleUrl: './product-carousel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCarousel {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) products!: Product[];

  @ViewChild('track') track?: ElementRef<HTMLDivElement>;

  protected readonly offset = signal(0);

  protected prev(): void {
    this.scrollBy(-320);
  }

  protected next(): void {
    this.scrollBy(320);
  }

  private scrollBy(delta: number): void {
    const el = this.track?.nativeElement;
    if (!el) {
      return;
    }
    el.scrollBy({ left: delta, behavior: 'smooth' });
  }
}
