import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  template: `
    <div class="wrap" role="status" aria-live="polite">
      <div class="skeleton hero"></div>
      <div class="skeleton line"></div>
      <div class="skeleton line short"></div>
      <span class="sr-only">Cargando contenido</span>
    </div>
  `,
  styles: `
    .wrap {
      max-width: var(--ef-max);
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    .skeleton {
      border-radius: 8px;
      background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
      background-size: 400% 100%;
      animation: sh 1.2s ease-in-out infinite;
    }
    .hero {
      height: 240px;
      margin-bottom: 1rem;
    }
    .line {
      height: 1rem;
      margin-bottom: 0.5rem;
    }
    .short {
      width: 60%;
    }
    @keyframes sh {
      0% {
        background-position: 100% 0;
      }
      100% {
        background-position: 0 0;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingState {}
