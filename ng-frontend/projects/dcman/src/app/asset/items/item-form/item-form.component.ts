import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Guid, ItemType, EditFunctions, ValidatorService } from 'backend-access';

import { Asset } from '../../../shared/objects/prototypes/asset.model';
import { Model } from '../../../shared/objects/model.model';
import { ExtendedAppConfigService } from '../../../shared/app-config.service';
import { Mappings } from '../../../shared/objects/appsettings/mappings.model';
import { noAction } from '../../../shared/store/basics/basics.actions';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {
  @Input() item: Asset;
  @Input() itemType: ItemType;
  @Output() submitted = new EventEmitter<Model>();
  @Output() deleted = new EventEmitter();
  createMode = false;
  form: FormGroup;

  constructor(private fb: FormBuilder, private validator: ValidatorService, private http: HttpClient) { }

  ngOnInit(): void {
    this.createMode = false;
    if (!this.item) {
      if (!this.itemType || !this.itemType.id) {
        // this should never occur
        return;
        this.createMode = true;
        this.item = new Asset();
        this.item.id = Guid.create().toString();
      }
    }
    
  }

}
