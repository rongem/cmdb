import { Directive, ElementRef, HostListener, HostBinding } from '@angular/core';

@Directive({
    selector: '[appClickOpen]',
    standalone: false
})
export class ClickOpenDirective {
    @HostBinding('class.open') isOpen = false;

    constructor(private eRef: ElementRef) {}

    @HostListener('click') open() {
        this.isOpen = !this.isOpen;
    }

    @HostListener('document:click', ['$event']) clickout(event: MouseEvent) {
        if(!this.eRef.nativeElement.contains(event.target)) {
            this.isOpen = false;
        }
    }
}
