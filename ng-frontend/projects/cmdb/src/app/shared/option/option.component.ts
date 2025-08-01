import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { fromEvent, map, Observable } from 'rxjs';

@Component({
    selector: 'app-option',
    templateUrl: './option.component.html',
    styleUrls: ['./option.component.scss'],
    standalone: false
})
export class OptionComponent implements OnInit {
  @Input() value: string;
  click$: Observable<string>;

  constructor(private host: ElementRef) { }

  get element() {  return this.host.nativeElement; }

  ngOnInit(): void {
    this.click$ = fromEvent(this.element, 'click').pipe(map(() => this.value));
  }

}
