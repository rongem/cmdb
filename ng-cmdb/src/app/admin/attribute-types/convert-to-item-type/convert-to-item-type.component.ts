import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
  transferrableAttributeTypes: Observable<AttributeType[]>;
  transferAttributeTypes: Guid[];
  conversionMethod = 'merge';
  newName = '';
  newColor = '#FFFFFF';
  newPosition = 'above';
  newConnectionType: Guid;

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
              // this.newConnectionType = state.connectionTypes[0].ConnTypeId;
              this.attributes = this.adminService.getAttributesForAttributeType(this.attributeTypeToConvert);
              this.transferrableAttributeTypes =
                this.adminService.getAttributeTypesForCorrespondingValuesOfType(this.attributeTypeToConvert);
              // this.transferAttributeTypes.push(this.typeId);
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

  log(ob: any) {
    console.log(ob);
    return ob;
  }
}
