import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { iif } from 'rxjs';
import { ItemType } from 'backend-access';

import * as fromApp from '../../shared/store/app.reducer';
import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';

import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { Mappings } from '../../shared/objects/appsettings/mappings.model';
import { EnclosureContainer } from '../../shared/objects/position/enclosure-container.model';
import { SlotInformation } from '../../shared/objects/position/slot-information.model';
import { Model } from '../../shared/objects/model.model';
import { EnclosureMountable } from '../../shared/objects/asset/enclosure-mountable.model';


@Component({
  selector: 'app-enclosure-form',
  templateUrl: './enclosure-form.component.html',
  styleUrls: ['./enclosure-form.component.scss']
})
export class EnclosureFormComponent implements OnInit {
  @Input() backSide: boolean;
  @Input() enclosureContainer: EnclosureContainer;
  @Input() slot: number;
  @Output() mounted = new EventEmitter<EnclosureMountable>();
  private slotInformations: SlotInformation[];
  maxWidth: number;
  maxHeight: number;
  selectedTypeId: string;
  selectedModelId: string;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.slotInformations = this.enclosureContainer.slotInformations;
    this.calculateAvailableArea();
  }

  get slotName() {
    return ExtendedAppConfigService.objectModel.OtherText.Slot;
  }

  get attributeNames() {
    return ExtendedAppConfigService.objectModel.AttributeTypeNames;
  }

  get enclosureMountableTypes() {
    return iif(() => this.backSide, this.store.select(fromSelectAsset.selectEnclosureMountableBackSideItemTypes),
      this.store.select(fromSelectAsset.selectEnclosureMountableFrontSideItemTypes));
  }

  get assetCountForFrontSideTypes() {
    return this.store.select(fromSelectAsset.selectUnMountedFrontEndEnclosureMountablesForSize,
      {maxHeight: this.maxHeight, maxWidth: this.maxWidth}).pipe(map(assets => assets.length));
  }

  getPossibleModels(type: ItemType) {
    return this.store.select(fromSelectAsset.selectUnMountedEnclosureMountableModelsForTypeAndSize,
      {typeId: type.id, maxHeight: this.maxHeight, maxWidth: this.maxWidth}
    );
  }

  getAssetsForTypeAndModel(type: ItemType, model: Model) {
    return this.store.select(fromSelectAsset.selectUnmountedEnclosureMountablesOfModelAndSize,
      {typeId: type.id, maxHeight: this.maxHeight, maxWidth: this.maxWidth, modelId: model.id}
    );
  }

  private calculateAvailableArea() {
    const slotInfo = this.slotInformations.find(s => s.index === this.slot);
    let row = slotInfo.row + 1;
    let verticalSlot = this.findSlot(row, slotInfo.column);
    while (verticalSlot && !verticalSlot.occupied) {
      verticalSlot = this.findSlot(++row, slotInfo.column);
    }
    let column = slotInfo.column + 1;
    let horizontalSlot = this.findSlot(slotInfo.row, column);
    while (horizontalSlot && !horizontalSlot.occupied) {
      horizontalSlot = this.findSlot(slotInfo.row, ++column);
    }
    this.maxHeight = row - slotInfo.row;
    this.maxWidth = column - slotInfo.column;
  }

  private findSlot(row: number, column: number) {
    return this.slotInformations.find(s => s.row === row && s.column === column);
  }

  mountEnclosureMountable(enclosureMountable: EnclosureMountable) {
    this.mounted.emit(enclosureMountable);
  }
}
