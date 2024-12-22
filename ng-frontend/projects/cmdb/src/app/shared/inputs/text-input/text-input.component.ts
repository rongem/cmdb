import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-text-input',
    templateUrl: './text-input.component.html',
    styleUrls: ['./text-input.component.scss'],
    standalone: false
})
export class TextInputComponent implements OnInit {
  @Input() originalText = '';
  @Input() minimumLength = 3;
  @Input() validationExpression = '^.*$';
  @Output() cancel: EventEmitter<void> = new EventEmitter();
  @Output() accept: EventEmitter<string> = new EventEmitter();

  text: string;

  constructor() { }

  get isValid() {
    return new RegExp(this.validationExpression).test(this.text);
  }

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
