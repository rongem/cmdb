import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormArray, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { SearchService } from '../search.service';

@Component({
  selector: 'app-search-responsibility',
  templateUrl: './search-responsibility.component.html',
  styleUrls: ['./search-responsibility.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchResponsibilityComponent),
      multi: true,
    }
  ]

})
export class SearchResponsibilityComponent implements OnInit, ControlValueAccessor {
  @Input() userName: string;
  disabled = false;

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  constructor(public searchService: SearchService) { }

  ngOnInit() {
  }

  onChange(event: MatSlideToggleChange) {
    if (event.checked) {
      this.searchService.addResponsibility(this.userName);
      this.propagateChange(this.userName);
    } else {
      this.searchService.deleteResponsibility();
      this.propagateChange('');
    }
  }

  writeValue(obj: any): void {}

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
