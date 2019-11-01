import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';

@Component({
  selector: 'app-multi-attributes',
  templateUrl: './multi-attributes.component.html',
  styleUrls: ['./multi-attributes.component.scss']
})
export class MultiAttributesComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() items: FullConfigurationItem[];
  @Input() attributeTypes: AttributeType[];

  constructor() { }

  ngOnInit() {
    
  }

}
