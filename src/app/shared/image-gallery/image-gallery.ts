import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.html',
  styleUrl: './image-gallery.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageGallery {
  @Input({ required: true }) images!: string[];
  @Input() alt = '';
  @Input() priority = false;

  protected readonly active = signal(0);

  protected select(i: number): void {
    this.active.set(i);
  }

  protected thumbSrc(src: string): string {
    return src || '/images/img.png';
  }

  protected activeSrc(): string {
    return this.images[this.active()] || '/images/content-img.png';
  }

  protected onThumbError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img && !img.src.endsWith('/images/img.png')) {
      img.src = '/images/img.png';
    }
  }

  protected onMainError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img && !img.src.endsWith('/images/content-img.png')) {
      img.src = '/images/content-img.png';
    }
  }
}
