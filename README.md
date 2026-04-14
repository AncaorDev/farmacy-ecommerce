# Ecommerce Farmacias — Challenge Frontend (Angular 21)

Aplicación de demostración: listado de productos, PDP con galería, precios multinivel, variante por radios, acordeón, carrusel de relacionados, carrito en `localStorage`, SSR y analítica simulada (`dataLayer`).

## Nota personal de implementación

Este proyecto lo trabajé con foco en 3 cosas: que se vea cercano al flujo real de ecommerce, que sea fácil de extender, y que sea rápido de entender por otro frontend.

- Priorizé una arquitectura simple (`core`, `shared`, `features`) para no sobre-ingenierizar el challenge.
- Migré el estado a **NgRx Signals** porque me dio una API más explícita para UI reactiva sin complejidad extra.
- Fui iterando UI por bloques (header -> listado -> PDP -> carrito -> footer) para mantener cambios pequeños y verificables.
- En cada ajuste visual, preferí componentes reutilizables antes que estilos acoplados a una sola vista.

## Requisitos

- **Node.js** 20+ (recomendado la LTS actual)
- **npm** 10+

## Instalación

```bash
cd ecommerce-farmacias
npm install
```

## Ejecución

**Desarrollo (cliente):**

```bash
npm run start:dev
```

Abre `http://localhost:4710/`.

**SSR (tras build):**

```bash
npm run build
npm run serve:ssr:ecommerce-farmacias
```

Por defecto el servidor escucha en el puerto **4000** (ver consola).

## Datos mock y estados simulados

- Catálogo: [`public/data/products.json`](public/data/products.json)
- Imágenes locales: [`public/images/`](public/images/)

**Loading:** el servicio aplica un retardo (~400–450 ms) para simular red.

**Error:** añade el query param `?simulateError=1` a la URL (por ejemplo `http://localhost:4710/?simulateError=1`) para forzar fallo en las peticiones de productos y ver la UI de error con **Reintentar**.

## Estructura de la solución

```
src/app/
  core/           # ProductStore, CartStore (NgRx Signals), SeoService, AnalyticsService, modelos
  layout/         # AppShell, banner, header, nav, footer
  shared/         # Breadcrumbs, galería, precios, acordeón, card, carrusel, loading/error
  features/       # Páginas listado y PDP (lazy-loaded)
public/
  data/           # JSON mock
  images/         # SVG de producto (optimizables en un entorno real)
```

- **Rutas:** `/` listado, `/productos/:slug` detalle. Layout común en `AppShell`.
- **Rendimiento:** rutas con `loadComponent`, imágenes con dimensiones explícitas y carga diferida en cards, prerender de la home y SSR en PDP (`app.routes.server.ts`).
- **Escalabilidad:** capas `core` / `shared` / `features`, componentes presentacionales con `OnPush`, estado de carrito y UI desacoplados de los datos mock.

## Optimizaciones de performance implementadas

- **Code splitting** por ruta (listado y PDP en chunks separados).
- **SSR + prerender** de la ruta estática `/` para HTML inicial útil; PDP en modo **server** por parámetro dinámico.
- **Imágenes optimizadas desde UI**: dimensiones fijas en render para reducir CLS, `loading="lazy"` en cards y fallback de imágenes para robustez de UX.
- **ChangeDetectionStrategy.OnPush** en componentes de presentación.
- **Assets locales** para evitar dependencias de CDN en el challenge (en producción se sustituirían por CDN + formatos WebP/AVIF).

## Preguntas obligatorias del challenge

### 1. ¿Qué decisiones tomaste para mejorar la performance en esta página?

Además de lo anterior: minimizar trabajo en el hilo principal con componentes `OnPush`, diferir trabajo no crítico fuera del camino de pintura, y priorizar el recurso LCP en la PDP marcando la imagen principal como `priority`. En producción mediría con Lighthouse/PageSpeed y RUM para ajustar `sizes`, compresión y TTFB del SSR.

### 2. ¿Cómo estructurarías esta solución para soportar múltiples marcas con diferentes estilos?

- **Design tokens** por marca (`--brand-primary`, tipografía, radios) inyectados por configuración (build-time `fileReplacements` o CSS por tenant).
- **Temas SCSS** o capa de **CSS variables** cargada según subdominio o `APP_INITIALIZER` que resuelve la marca y aplica una clase en `<body>` (ej. `brand-inkafarma`).
- Componentes sin colores fijos en el TS; solo tokens en estilos.
- Opcional: librerías tipo **Storybook** por marca y contratos de UI compartidos.

### 3. Si esta página presenta problemas de LCP en producción, ¿cómo lo abordarías?

- Confirmar el **elemento LCP** (suele ser la imagen hero de la PDP): optimizar peso (formato moderno, dimensiones correctas), `fetchpriority`/prioridad de imagen, **preload** del recurso crítico si es estable.
- Revisar **TTFB** del HTML (SSR lento, cold starts, región del hosting).
- Reducir JS que bloquee el render en above-the-fold; validar hidratación.
- Validar CDN, caché de borde y **HTTP/2**/**HTTP/3**.

### 4. ¿Cómo evitarías que eventos de Analytics se disparen múltiples veces en una SPA?

- Enviar **page_view** / eventos de página solo en `NavigationEnd` (o equivalente), deduplicando por `url + navigationId` del router.
- Para eventos de vista de producto: un **idempotente** por `slug` o `productId` hasta la siguiente navegación (en esta app se evita repetir `view_item` con `lastViewTracked`).
- Evitar doble disparo en **hidratación**: ejecutar tracking en el cliente tras contenido estable (`afterNextRender` / `requestIdleCallback` si aplica).
- Cola central en `AnalyticsService` con debounce opcional para eventos repetidos.

### 5. ¿Qué consideraciones SEO tendrías en cuenta para esta página en un entorno real?

- **Metadatos** únicos por PDP (`title`, `description`, Open Graph), **canonical** por URL limpia.
- **Datos estructurados** `Product` (JSON-LD) con precio, disponibilidad y SKU.
- **Sitemap** y **robots.txt**; `noindex` en staging.
- Contenido real en HTML (SSR) para crawlers; hreflang si hay varias regiones/idiomas.
- Evitar contenido duplicado entre variantes (canonical a URL principal o parámetros gestionados).

## Bonus: analítica

`AnalyticsService` envía a `window.dataLayer`:

- **Momento de disparo**
  - `view_item`: cuando la PDP carga producto válido (después de resolver datos, no en placeholder/loading).
  - `add_to_cart`: al confirmar la acción de agregado al carrito desde PDP.
- **Estructura del evento**
  - Se usa `dataLayer.push({ event, ecommerce })` con objeto `items` (campos `item_id`, `item_name`, `item_variant`, `price`, `quantity`) y `currency`/`value` en el contenedor `ecommerce`.
- **Desacoplamiento**
  - Los componentes de UI no manipulan `window` ni construyen payloads manualmente.
  - Todo pasa por `AnalyticsService`, que centraliza formato y envío.

Ejemplo simplificado:

```ts
dataLayer.push({
  event: 'view_item',
  ecommerce: {
    currency: 'PEN',
    value: 89.9,
    items: [
      {
        item_id: '123456',
        item_name: 'Pharamol Antigripal...',
        item_variant: 'Sobre',
        price: 89.9,
        quantity: 1
      }
    ]
  }
});
```

## Licencia / uso

Proyecto de demostración para challenge técnico.
