import { OverlayRef, Overlay, ConnectionPositionPair } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Directive, ElementRef, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { filter, fromEvent, Subscription, takeUntil } from 'rxjs';
import { AutocompleteComponent } from './autocomplete.component';

const overlayClickOutside = (overlayRef: OverlayRef, origin: HTMLElement) => fromEvent<MouseEvent>(document, 'click').pipe(
    filter(event => {
        const clickTarget = event.target as HTMLElement;
        const notOrigin = clickTarget !== origin;
        const notOverlay = !!overlayRef && (overlayRef.overlayElement.contains(clickTarget) === false);
        return notOrigin && notOverlay;
    }),
    takeUntil(overlayRef.detachments())
);

@Directive({selector: '[appAutocomplete]'})
export class AutocompleteDirective implements OnInit, OnDestroy {
    @Input() appAutocomplete: AutocompleteComponent;
    private overlayRef: OverlayRef;
    private subscription: Subscription;

    constructor(
        private host: ElementRef<HTMLInputElement>,
        private ngControl: NgControl,
        private vcr: ViewContainerRef,
        private overlay: Overlay
    ) {}

    get control() {
        return this.ngControl.control;
    }

    get origin() {
        return this.host.nativeElement;
    }

    ngOnInit(): void {
        this.subscription = fromEvent(this.origin, 'focus').subscribe(() => {
            this.openDropdown();
            this.appAutocomplete.optionsClick().pipe(
                takeUntil(this.overlayRef.detachments())
            ).subscribe(value => {
              this.control.setValue(value);
              this.close();
            });
        });
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    openDropdown(): void {
        this.overlayRef = this.overlay.create({
            width: this.origin.offsetWidth,
            maxHeight: 40 * 3,
            backdropClass: '',
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            positionStrategy: this.getOverlayPosition()
        });

        const template = new TemplatePortal(this.appAutocomplete.rootTemplate, this.vcr);
        this.overlayRef.attach(template);
        overlayClickOutside(this.overlayRef, this.origin).subscribe(() => this.close());
    }

    private close() {
        this.overlayRef.detach();
        this.overlayRef = null;
    }

    private getOverlayPosition() {
        const positions = [
            new ConnectionPositionPair(
                { originX: 'start', originY: 'bottom' },
                { overlayX: 'start', overlayY: 'top' }
            )
        ];
        return this.overlay
            .position()
            .flexibleConnectedTo(this.origin)
            .withPositions(positions)
            .withFlexibleDimensions(false)
            .withPush(false);
    }
}
