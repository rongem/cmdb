import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form-popup',
  templateUrl: './form-popup.component.html',
  styleUrls: ['./form-popup.component.scss']
})
export class FormPopupComponent implements OnInit {
  @Output() closed = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  close() {
    this.closed.emit();
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
