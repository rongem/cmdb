import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable} from 'rxjs';
import { map, withLatestFrom, take } from 'rxjs/operators';
import { Guid } from 'src/app/shared/guid';
import { Store, select } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as AdminActions from 'src/app/admin/store/admin.actions';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';

import { AdminService } from '../../admin.service';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';

@Component({
  selector: 'app-convert-to-item-type',
  templateUrl: './convert-to-item-type.component.html',
  styleUrls: ['./convert-to-item-type.component.scss'],
  animations: [
    trigger('swapDirectionOfUpper', [
      transition('above => below', [
        style({
          transform: 'translateY(150px)',
        }),
        animate(200, style({
          transform: 'translateY(50px) translateX(20px)',
        })),
        animate(300)
      ]),
      transition('below => above', [
        style({
          transform: 'translateY(-150px)',
        }),
        animate(200, style({
          transform: 'translateY(-50px) translateX(-20px)',
        })),
        animate(300)
      ]),
    ]),
    trigger('swapDirectionOfLower', [
      transition('below => above', [
        style({
          transform: 'translateY(150px)',
        }),
        animate(200, style({
          transform: 'translateY(50px) translateX(20px)',
        })),
        animate(300)
      ]),
      transition('above => below', [
        style({
          transform: 'translateY(-150px)',
        }),
        animate(200, style({
          transform: 'translateY(-50px) translateX(-20px)',
        })),
        animate(300)
      ]),
    ]),
  ],
})
export class ConvertToItemTypeComponent implements OnInit {
  typeId: Guid;
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
          this.store.select(fromApp.METADATA).pipe(
            withLatestFrom(this.store.pipe(select(fromSelectMetaData.selectSingleAttributeType, this.typeId))),
            map((status) => {
              console.log(status);
              if (status[1] === undefined) {
                console.log('No attribute type with id ' + this.typeId + ' found');
                this.router.navigate(['admin', 'attribute-types']);
              }
              this.attributeTypeToConvert = status[1];
              const itemTypes = status[0].itemTypes.filter(t =>
                t.TypeName.toLocaleLowerCase() === this.attributeTypeToConvert.TypeName.toLocaleLowerCase());
              this.itemType = itemTypes.length > 0 ? itemTypes[0] : undefined;
              this.newColor = this.itemType ? this.itemType.TypeBackColor : '#FFFFFF';
              this.newConnectionType = status[0].connectionTypes[0].ConnTypeId;
              this.connectionType = status[0].connectionTypes[0];
              this.attributes = this.adminService.getAttributesForAttributeType(this.attributeTypeToConvert);
              const sub = this.adminService.getAttributeTypesForCorrespondingValuesOfType(this.attributeTypeToConvert)
                .subscribe((values) => {
                this.transferrableAttributeTypes = values;
                sub.unsubscribe();
              });
              return status[0];
            }),
            take(1),
          ).subscribe();
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
          a.TypeName > b.TypeName ? 1 : (a.TypeName < b.TypeName ? -1 : 0));
      }
    } else {
      this.transferAttributeTypes = this.transferAttributeTypes.filter(t => t.TypeId !== guid);
    }
  }

  onSubmit() {
    this.store.dispatch(AdminActions.convertAttributeTypeToItemType({
      attributeType: this.attributeTypeToConvert,
      newItemTypeName: this.newName,
      colorCode: this.newColor,
      connectionType: this.connectionType,
      position: this.newPosition,
      attributeTypesToTransfer: this.transferAttributeTypes,
    }));
    this.router.navigate(['admin', 'item-types']);
  }

  get connectionTypes() {
    return this.store.pipe(select(fromSelectMetaData.selectConnectionTypes));
  }

  getConnectionType(connTypeId: Guid) {
    return this.store.pipe(select(fromSelectMetaData.selectSingleConnectionType, connTypeId));
  }

}