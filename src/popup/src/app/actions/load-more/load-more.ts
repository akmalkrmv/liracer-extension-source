import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'app-load-more',
  templateUrl: './load-more.html',
})
export class LoadMore {
  public readonly canLoadMore: InputSignal<boolean> = input.required<boolean>();
  public readonly clicked: OutputEmitterRef<void> = output<void>();
}
