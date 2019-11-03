import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';

@Component({
  selector: 'app-multi-add-links',
  templateUrl: './multi-add-links.component.html',
  styleUrls: ['./multi-add-links.component.scss']
})
export class MultiAddLinksComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() items: FullConfigurationItem[];

  constructor() { }

  ngOnInit() {
  }

}
