import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit {
  @Input()
  originalText = '';

  @Input()
  minimumLength = 3;
  @Output()
  cancel: EventEmitter<void> = new EventEmitter();

  @Output()
  accept: EventEmitter<string> = new EventEmitter();

  text: string;

  constructor() { }

  ngOnInit() {
    this.text = this.originalText;
  }

  onAccept() {
    if (this.text === this.originalText || this.text.length < this.minimumLength) {
      return;
    }
    this.accept.emit(this.text);
  }

  onCancel() {
    this.cancel.emit();
  }

}
