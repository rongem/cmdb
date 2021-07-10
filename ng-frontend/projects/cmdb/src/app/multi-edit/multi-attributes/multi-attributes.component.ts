import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { FullConfigurationItem, AttributeType } from 'backend-access';

@Component({
  selector: 'app-multi-attributes',
  templateUrl: './multi-attributes.component.html',
  styleUrls: ['./multi-attributes.component.scss']
})
export class MultiAttributesComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() items: FullConfigurationItem[];
  @Input() attributeTypes: AttributeType[];
  attributes: FormArray;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.attributes = this.form.get('attributes') as FormArray;
    this.attributeTypes.forEach(attributeType => {
      this.attributes.push(this.fb.group({
        edit: false,
        typeId: attributeType.id,
        type: attributeType.name,
        value: '',
      }));
    });
  }

  getValuesForAttributeType(typeId: string) {
    return [...new Set(this.items.filter(item =>
      item.attributes.findIndex(att => att.typeId === typeId) > -1).map(item =>
      item.attributes.find(att => att.typeId === typeId).value).sort())];
  }
}
