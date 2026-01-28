import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface ButtonOption {
  value: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-button-group',
  imports: [MatIconModule],
  templateUrl: './button-group.html',
})
export class ButtonGroupComponent {
  public readonly options: InputSignal<ButtonOption[]> = input.required<ButtonOption[]>();
  public readonly selectedValue: InputSignal<string> = input.required<string>();
  public readonly valueChanged: OutputEmitterRef<string> = output<string>();

  public selectOption(value: string): void {
    this.valueChanged.emit(value);
  }
}
