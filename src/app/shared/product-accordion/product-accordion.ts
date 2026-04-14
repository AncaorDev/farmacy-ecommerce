import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  signal
} from '@angular/core';
import { AccordionSection } from '../../core/models/product.model';

@Component({
  selector: 'app-product-accordion',
  templateUrl: './product-accordion.html',
  styleUrl: './product-accordion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductAccordion implements OnChanges {
  @Input({ required: true }) sections!: AccordionSection[];

  protected readonly openId = signal<string | null>(null);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sections'] && this.sections?.length && this.openId() === null) {
      this.openId.set(this.sections[0].id);
    }
  }

  protected toggle(id: string): void {
    this.openId.update((cur) => (cur === id ? null : id));
  }

  protected isOpen(id: string): boolean {
    return this.openId() === id;
  }
}
