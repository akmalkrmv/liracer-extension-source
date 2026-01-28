import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { IRun } from '../run.model';
import { sum } from '../../services/utils';

@Component({
  selector: 'app-runs-total-info',
  imports: [],
  templateUrl: './runs-total-info.html',
  styleUrl: './runs-total-info.css',
})
export class RunsTotalInfo {
  public readonly runs: InputSignal<IRun[]> = input.required();

  protected readonly unsolvedCount: Signal<number> = computed(() => {
    return sum(this.runs().flatMap((run: IRun) => run.unsolved.length));
  });
}
