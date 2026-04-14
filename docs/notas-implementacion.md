# Notas de implementación (bitácora corta)

## Objetivo práctico

Construir un flujo mínimo de ecommerce con buena base técnica para crecer, sin backend real.

## Decisiones que tomé

- **Estado global**: usé `ProductStore` y `CartStore` con NgRx Signals para separar datos de UI.
- **Mock local**: mantuve `public/data/products.json` como fuente única para simplificar pruebas.
- **Escalabilidad**: componentes compartidos para galería, card, precios y acordeón.
- **Rendimiento**: lazy loading por rutas, `OnPush`, SSR en PDP y prerender en home.
- **SEO técnico**: metadatos por página y estructura semántica base.

## Trade-offs (lo que acepté en el challenge)

- No integrar backend real ni stock dinámico.
- Mantener favoritos solo a nivel UI (sin persistencia completa).
- Priorización de UX visual sobre reglas comerciales complejas.

## Si tuviera una siguiente iteración

- Añadir tests de componentes críticos (`product-card`, `product-detail-page`, `cart-page`).
- Persistir favoritos y agregar vista dedicada.
- Normalizar catálogo para variantes complejas (precio, imagen y stock por variante).
- Mejorar estrategia de imágenes (formatos modernos y compresión por entorno).

## Checklist rápido para demo

- Home carga catálogo y permite búsqueda.
- PDP muestra detalle, variantes, precios y carrito reactivo.
- Carrito permite subir/bajar cantidad y remover líneas.
- Estados de loading y error visibles con `simulateError=1`.
