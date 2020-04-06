import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appHover]'
})
export class HoverDirective {
  @HostBinding('class.open') isOpen = false;

  @HostListener('mouseenter') open() {
    this.isOpen = true;
  }

  @HostListener('mouseleave') close() {
    this.isOpen = false;
  }
}
