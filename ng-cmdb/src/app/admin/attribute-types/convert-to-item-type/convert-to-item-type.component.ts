import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { Guid } from 'guid-typescript';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';
import * as AdminActions from 'src/app/admin/store/admin.actions';

import { AdminService } from '../../admin.service';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';

@Component({
  selector: 'app-convert-to-item-type',
  templateUrl: './convert-to-item-type.component.html',
  styleUrls: ['./convert-to-item-type.component.scss']
})
export class ConvertToItemTypeComponent implements OnInit {
  typeId: Guid;
  meta: Observable<fromMetaData.State>;
  attributeTypeToConvert: AttributeType;
  itemType: ItemType;
  attributes: Observable<ItemAttribute[]>;
  transferrableAttributeTypes: AttributeType[];
  transferAttributeTypes: AttributeType[] = [];
  conversionMethod = 'merge';
  newName = '';
  newColor = '#FFFFFF';
  newPosition = 'above';
  newConnectionType: Guid;
  connectionType: ConnectionType;

  constructor(private store: Store<fromApp.AppState>,
              private route: ActivatedRoute,
              private router: Router,
              private adminService: AdminService,
              public dialog: MatDialog) { }

  ngOnInit() {
    if (this.route.snapshot.params.id && Guid.isGuid(this.route.snapshot.params.id) &&
        this.route.snapshot.routeConfig.path.startsWith('convert/:id')) {
          this.typeId = this.route.snapshot.params.id as Guid;
          this.meta = this.store.select(fromApp.METADATA).pipe(
            tap(state => {
              if (!state.attributeTypesMap.has(this.typeId)) {
                console.log('No attribute type with id ' + this.typeId + ' found');
                this.router.navigate(['admin', 'attribute-types']);
              }
              this.attributeTypeToConvert = state.attributeTypesMap.get(this.typeId);
              const itemTypes = state.itemTypes.filter(t =>
                t.TypeName.toLocaleLowerCase() === this.attributeTypeToConvert.TypeName.toLocaleLowerCase());
              this.itemType = itemTypes.length > 0 ? itemTypes[0] : undefined;
              this.newColor = this.itemType ? this.itemType.TypeBackColor : '#FFFFFF';
              this.newConnectionType = state.connectionTypes[0].ConnTypeId;
              this.connectionType = state.connectionTypes[0];
              this.attributes = this.adminService.getAttributesForAttributeType(this.attributeTypeToConvert);
              const sub = this.adminService.getAttributeTypesForCorrespondingValuesOfType(this.attributeTypeToConvert)
                .subscribe((values) => {
                this.transferrableAttributeTypes = values;
                sub.unsubscribe();
              });
            })
          );
    } else {
      console.log('illegal id params');
      this.router.navigate(['admin', 'attribute-types']);
    }
  }

  filterAttributeTypes(list: AttributeType[]) {
    if (this.attributeTypeToConvert) {
      return list.filter(at => at.AttributeGroup === this.attributeTypeToConvert.AttributeGroup);
    }
    return [];
  }

  toggleDirection() {
    this.newPosition = this.newPosition === 'above' ? 'below' : 'above';
  }

  toggleConversion() {
    this.conversionMethod = this.conversionMethod === 'merge' ? 'rename' : 'merge';
  }

  onChangeItemBackgroundColor(color: string) {
    this.newColor = color.toUpperCase();
  }

  onChangeConnectionType(connType: Guid) {
    this.newConnectionType = connType;
  }

  onChangeAttributeToTransfer(guid: Guid, selected: boolean) {
    if (selected) {
      this.transferAttributeTypes.push(this.transferrableAttributeTypes.find(t => t.TypeId === guid));
      if (this.transferAttributeTypes.length > 1) {
        this.transferAttributeTypes = this.transferAttributeTypes.sort((a, b) =>
          a.TypeName > b.TypeName ? 1 : (a.TypeName < b.TypeName ? -1 : 0))
      }
    } else {
      this.transferAttributeTypes = this.transferAttributeTypes.filter(t => t.TypeId !== guid);
    }
  }

  onSubmit() {
    this.store.dispatch(new AdminActions.ConvertAttributeTypeToItemType({
      attributeType: this.attributeTypeToConvert,
      newItemTypeName: this.newName,
      colorCode: this.newColor,
      connectionType: this.connectionType,
      position: this.newPosition,
      attributeTypesToTransfer: this.transferAttributeTypes,
    }));
    this.router.navigate(['admin', 'item-types']);
  }
}
