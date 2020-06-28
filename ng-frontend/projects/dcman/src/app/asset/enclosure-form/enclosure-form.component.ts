import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromApp from '../../shared/store/app.reducer';
import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';
import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';

import { BladeEnclosure } from '../../shared/objects/asset/blade-enclosure.model';
import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { Mappings } from '../../shared/objects/appsettings/mappings.model';


@Component({
  selector: 'app-enclosure-form',
  templateUrl: './enclosure-form.component.html',
  styleUrls: ['./enclosure-form.component.scss']
})
export class EnclosureFormComponent implements OnInit {
  @Input() backSide: boolean;
  @Input() enclosure: BladeEnclosure;
  @Input() slot: number;
  @Input() minFreeSlot: number;
  @Input() maxFreeSlot: number;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
  }

  get slotName() {
    return ExtendedAppConfigService.objectModel.OtherText.Slot;
  }

  get attributeNames() {
    return ExtendedAppConfigService.objectModel.AttributeTypeNames;
  }

  get enclosureMountableTypes() {
    return this.store.select(fromSelectAsset.selectRackMountableItemTypes).pipe(
      map(types => this.backSide ?
        types.filter(t => Mappings.enclosureBackSideMountables.includes(t.name.toLocaleLowerCase())) :
        types.filter(t => !Mappings.enclosureBackSideMountables.includes(t.name.toLocaleLowerCase()))
      ),
    );
  }

  calculatePosition(slot: number) {
    return {
      column: slot % this.enclosure.model.width,
      row: Math.abs(slot / this.enclosure.model.width) + 1,
    };
  }

}
