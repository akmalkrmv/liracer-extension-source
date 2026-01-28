import { Directive, HostListener } from '@angular/core';
import { LinkHandlerService } from '../services/link-handler.service';

@Directive({
  selector: 'a[external]',
  standalone: true,
})
export class ExternalLinkDirective {
  constructor(private links: LinkHandlerService) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const anchor = event.currentTarget as HTMLAnchorElement;
    if (!anchor?.href) return;

    event.preventDefault();
    event.stopPropagation();

    this.links.navigate(anchor.href, event.button === 0);
  }
}
