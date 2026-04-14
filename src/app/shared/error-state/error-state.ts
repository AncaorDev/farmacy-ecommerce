import { ChangeDetectionStrategy, Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.html',
  styleUrl: './error-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorState {
  @Input({ required: true }) message!: string;
  readonly retry = output<void>();
}
