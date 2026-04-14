import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { Product } from '../models/product.model';

interface CatalogResponse {
  products: Product[];
}

interface ProductState {
  catalog: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  catalog: [],
  loading: false,
  error: null
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const http = inject(HttpClient);
    const platformId = inject(PLATFORM_ID);
    const dataUrl = '/data/products.json';

    const hasSimulatedError = () =>
      isPlatformBrowser(platformId) && globalThis.location.search.includes('simulateError=1');

    const ensureCatalogLoaded = async (): Promise<Product[]> => {
      if (store.catalog().length) {
        return store.catalog();
      }
      const response = await firstValueFrom(http.get<CatalogResponse>(dataUrl));
      patchState(store, { catalog: response.products });
      return response.products;
    };

    return {
      clearError(): void {
        patchState(store, { error: null });
      },

      async getProducts(): Promise<Product[]> {
        patchState(store, { loading: true, error: null });
        try {
          await wait(450);
          if (hasSimulatedError()) {
            throw new Error('Error simulado al cargar productos');
          }
          const catalog = await ensureCatalogLoaded();
          patchState(store, { loading: false });
          return catalog;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Error al cargar productos';
          patchState(store, { loading: false, error: message });
          throw new Error(message);
        }
      },

      async getProductBySlug(slug: string): Promise<Product | undefined> {
        patchState(store, { loading: true, error: null });
        try {
          await wait(400);
          if (hasSimulatedError()) {
            throw new Error('Error simulado al cargar el producto');
          }
          const catalog = await ensureCatalogLoaded();
          const product = catalog.find((item) => item.slug === slug);
          patchState(store, { loading: false });
          return product;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Error al cargar el producto';
          patchState(store, { loading: false, error: message });
          throw new Error(message);
        }
      },

      async getProductById(id: string): Promise<Product | undefined> {
        const catalog = await ensureCatalogLoaded();
        return catalog.find((item) => item.id === id);
      },

      async getRelated(ids: string[]): Promise<Product[]> {
        const catalog = await ensureCatalogLoaded();
        return ids.map((id) => catalog.find((product) => product.id === id)).filter(Boolean) as Product[];
      }
    };
  })
);
