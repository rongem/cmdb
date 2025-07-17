import { Component, OnInit, forwardRef, Output, EventEmitter, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

function validateColor(color: string): string {
    if (!color)
      return undefined;
    color = color.toUpperCase();
    if (color.match('^#[A-F0-9]{3}$')) {
      color = color[0] + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    if (color.match('^#[A-F0-9]{6}$')) {
      return color;
    }
    return undefined;
}

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
    ],
    standalone: false
})
export class ColorPickerComponent implements OnInit, ControlValueAccessor {
  @Output() colorChange = new EventEmitter<string>();
  @Output() colorPickerOpen = new EventEmitter<void>();
  @Input() disabled = false;
  open = false;
  hue: string;
  private color$: string;

  constructor() { }

  get validColor() {
    return this.color && this.color.match('^#[A-F0-9]{6}$');
  }

  @Input({transform: validateColor}) color: string;

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  ngOnInit() {
  }

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
      this.open = false;
    }
  }

  onCancel() {
    this.open = false;
  }
}
