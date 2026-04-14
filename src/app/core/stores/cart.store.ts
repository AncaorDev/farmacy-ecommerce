import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, computed, effect, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { Product, ProductVariant } from '../models/product.model';

export interface CartLine {
  productId: string;
  productName: string;
  slug: string;
  variantId: string;
  variantLabel: string;
  unitPrice: number;
  currency: string;
  quantity: number;
  image: string;
}

interface CartState {
  lines: CartLine[];
}

const STORAGE_KEY = 'ef_cart_v1';

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState<CartState>({ lines: [] }),
  withComputed(({ lines }) => ({
    totalItems: computed(() => lines().reduce((acc, line) => acc + line.quantity, 0)),
    linesReadonly: computed(() => lines())
  })),
  withMethods((store) => ({
    addItem(params: {
      product: Product;
      variant: ProductVariant;
      quantity?: number;
    }): void {
      const { product, variant } = params;
      const quantity = params.quantity ?? 1;
      const imgs = variant.images?.length ? variant.images : product.images;
      const image = imgs[0] ?? product.images[0];
      const unitPrice = variant.fromPrice;

      patchState(store, (state) => {
        const idx = state.lines.findIndex(
          (line) => line.productId === product.id && line.variantId === variant.id
        );
        if (idx >= 0) {
          const next = [...state.lines];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
          return { lines: next };
        }
        const line: CartLine = {
          productId: product.id,
          productName: product.name,
          slug: product.slug,
          variantId: variant.id,
          variantLabel: variant.label,
          unitPrice,
          currency: product.currency,
          quantity,
          image
        };
        return { lines: [...state.lines, line] };
      });
    },

    getQuantity(productId: string, variantId: string): number {
      const line = store.lines().find(
        (item) => item.productId === productId && item.variantId === variantId
      );
      return line?.quantity ?? 0;
    },

    increaseItem(productId: string, variantId: string, amount = 1): void {
      if (amount <= 0) {
        return;
      }
      patchState(store, (state) => ({
        lines: state.lines.map((line) =>
          line.productId === productId && line.variantId === variantId
            ? { ...line, quantity: line.quantity + amount }
            : line
        )
      }));
    },

    decreaseItem(productId: string, variantId: string, amount = 1): void {
      if (amount <= 0) {
        return;
      }
      patchState(store, (state) => ({
        lines: state.lines
          .map((line) =>
            line.productId === productId && line.variantId === variantId
              ? { ...line, quantity: line.quantity - amount }
              : line
          )
          .filter((line) => line.quantity > 0)
      }));
    },

    removeItem(productId: string, variantId: string): void {
      patchState(store, (state) => ({
        lines: state.lines.filter(
          (line) => !(line.productId === productId && line.variantId === variantId)
        )
      }));
    }
  })),
  withHooks((store) => {
    const platformId = inject(PLATFORM_ID);
    return {
    onInit() {
      if (isPlatformBrowser(platformId)) {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          try {
            patchState(store, { lines: JSON.parse(raw) as CartLine[] });
          } catch {
            /* ignore parse errors */
          }
        }
      }

      effect(() => {
        if (!isPlatformBrowser(platformId)) {
          return;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store.lines()));
      });
    }
  };
  })
);
