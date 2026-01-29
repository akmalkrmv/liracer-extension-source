import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface ButtonOption<T> {
  value: T;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-button-group',
  imports: [MatIconModule],
  templateUrl: './button-group.html',
})
export class ButtonGroupComponent<T> {
  public readonly options: InputSignal<ButtonOption<T>[]> = input.required<ButtonOption<T>[]>();
  public readonly selectedValue: InputSignal<T | undefined> = input<T>();
  public readonly valueChanged: OutputEmitterRef<T> = output<T>();

  public selectOption(value: T): void {
    this.valueChanged.emit(value);
  }
}
