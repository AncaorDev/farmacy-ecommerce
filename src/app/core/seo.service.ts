import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  setProductPage(title: string, description: string, imageUrl?: string, canonicalPath?: string): void {
    const fullTitle = `${title} | Inkafarma — Challenge`;
    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    if (imageUrl) {
      const absolute =
        imageUrl.startsWith('http') ? imageUrl : `${this.getOrigin()}${imageUrl}`;
      this.meta.updateTag({ property: 'og:image', content: absolute });
    }
    this.meta.updateTag({ property: 'og:type', content: 'product' });
    if (canonicalPath) {
      const link = `${this.getOrigin()}${canonicalPath}`;
      this.setCanonical(link);
    }
  }

  setListingPage(): void {
    const title = 'Catálogo de productos | Inkafarma — Challenge';
    this.title.setTitle(title);
    const desc = 'Listado de productos de demostración para el challenge frontend.';
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.setCanonical(`${this.getOrigin()}/`);
  }

  private getOrigin(): string {
    return this.document.location?.origin ?? '';
  }

  private setCanonical(href: string): void {
    const head = this.document.head;
    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
