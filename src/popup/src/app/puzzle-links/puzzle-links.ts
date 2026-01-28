import { Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { ClipboardService } from '../services/clipboard.service';
import { LinkHandlerService } from '../services/link-handler.service';
import { ExternalLinkDirective } from '../directives/external-link.directive';

@Component({
  selector: 'app-puzzle-links',
  imports: [ExternalLinkDirective],
  templateUrl: './puzzle-links.html',
  styles: ``,
})
export class PuzzleLinks {
  private readonly clipboard: ClipboardService = inject(ClipboardService);
  private readonly linkHandler: LinkHandlerService = inject(LinkHandlerService);

  public readonly label: InputSignal<string> = input.required();
  public readonly prefix: InputSignal<string> = input.required();
  public readonly puzzleIds: InputSignal<string[]> = input.required();
  public readonly linkClass: InputSignal<string | undefined> = input();

  protected readonly currentTabUrl: Signal<string> = this.linkHandler.currentTabUrl;
  protected readonly links: Signal<string[]> = computed(() => {
    return this.puzzleIds().map((puzzleId: string) => `${this.prefix()}${puzzleId}`);
  });

  protected copyLinks() {
    const content: string = this.links().join('\n');
    this.clipboard.copy(content, 'Links copied');
  }
}
