import { Component, OnInit, forwardRef, Output, EventEmitter, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true,
    }
  ]
})
export class ColorPickerComponent implements OnInit, ControlValueAccessor {
  hue: string;
  private color$: string;
  @Output() colorChange = new EventEmitter<string>();
  @Output() colorPickerOpen = new EventEmitter<void>();
  open = false;
  @Input() disabled = false;
  constructor() { }

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  ngOnInit() {
  }

  get validColor() {
    return this.color && this.color.match('^#[A-F0-9]{6}$');
  }

  @Input() set color(color: string) {
    if (!color) {
      this.color$ = undefined;
      return;
    }
    color = color.toUpperCase();
    if (color.match('^#[A-F0-9]{3}$')) {
      color = color[0] + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    if (color.match('^#[A-F0-9]{6}$')) {
      this.color$ = color;
    }
  }
  get color() { return this.color$; }

  writeValue(obj: any): void {
    if (typeof obj === 'string' || !obj) {
      this.color = obj;
    }
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onOpenColorPicker() {
    this.open = true;
    this.colorPickerOpen.emit();
  }

  onChangeColor() {
    if (this.validColor) {
      this.colorChange.emit(this.color);
    }
  }

  onCancel() {
    this.open = false;
  }

}
